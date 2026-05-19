import stripe
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.config import settings
from app.models.user import User
from app.models.subscription import Subscription, PlanType, SubscriptionStatus

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(db: Session, user: User) -> str:
    # Create stripe customer if not exists
    if not user.stripe_customer_id:
        customer = stripe.Customer.create(
            email=user.email,
            metadata={"user_id": user.id}
        )
        user.stripe_customer_id = customer.id
        db.commit()

    # Create checkout session
    try:
        session = stripe.checkout.Session.create(
            customer=user.stripe_customer_id,
            payment_method_types=["card"],
            line_items=[
                {
                    "price": settings.STRIPE_PRO_PRICE_ID,
                    "quantity": 1
                }
            ],
            mode="subscription",
            success_url=f"{settings.FRONTEND_URL}/app/billing?success=true",
            cancel_url=f"{settings.FRONTEND_URL}/app/billing?canceled=true",
            metadata={"user_id": user.id}
        )
        return session.url
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

def cancel_subscription(db: Session, user: User) -> dict:
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user.id
    ).first()

    if not subscription or not subscription.stripe_subscription_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )

    try:
        stripe.Subscription.cancel(subscription.stripe_subscription_id)
        subscription.status = SubscriptionStatus.canceled
        subscription.plan = PlanType.free
        db.commit()
        return {"message": "Subscription canceled successfully"}
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

def get_user_subscription(db: Session, user_id: int):
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).first()
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    return subscription

def handle_webhook_event(db: Session, payload: bytes, sig_header: str):
    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payload"
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature"
        )

    # Handle events
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        _handle_checkout_completed(db, session)

    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        _handle_subscription_updated(db, subscription)

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        _handle_subscription_deleted(db, subscription)

    return {"status": "ok"}

def _handle_checkout_completed(db: Session, session: dict):
    user_id = int(session["metadata"]["user_id"])
    stripe_subscription_id = session.get("subscription")
    stripe_customer_id = session.get("customer")

    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).first()

    if subscription:
        subscription.stripe_subscription_id = stripe_subscription_id
        subscription.stripe_customer_id = stripe_customer_id
        subscription.plan = PlanType.pro
        subscription.status = SubscriptionStatus.active
    else:
        subscription = Subscription(
            user_id=user_id,
            stripe_subscription_id=stripe_subscription_id,
            stripe_customer_id=stripe_customer_id,
            plan=PlanType.pro,
            status=SubscriptionStatus.active
        )
        db.add(subscription)
    db.commit()

def _handle_subscription_updated(db: Session, stripe_sub: dict):
    subscription = db.query(Subscription).filter(
        Subscription.stripe_subscription_id == stripe_sub["id"]
    ).first()

    if subscription:
        stripe_status = stripe_sub["status"]
        if stripe_status == "active":
            subscription.status = SubscriptionStatus.active
            subscription.plan = PlanType.pro
        elif stripe_status == "past_due":
            subscription.status = SubscriptionStatus.past_due
        db.commit()

def _handle_subscription_deleted(db: Session, stripe_sub: dict):
    subscription = db.query(Subscription).filter(
        Subscription.stripe_subscription_id == stripe_sub["id"]
    ).first()

    if subscription:
        subscription.status = SubscriptionStatus.canceled
        subscription.plan = PlanType.free
        subscription.stripe_subscription_id = None
        db.commit()