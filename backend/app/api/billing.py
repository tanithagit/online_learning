from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.subscription import SubscriptionResponse, CheckoutSessionResponse
from app.services.billing_service import (
    create_checkout_session,
    cancel_subscription,
    get_user_subscription,
    handle_webhook_event
)
from app.models.user import User

router = APIRouter()

# Get current subscription
@router.get("/subscription", response_model=SubscriptionResponse)
def get_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_subscription(db, current_user.id)

# Create checkout session
@router.post("/create-checkout-session", response_model=CheckoutSessionResponse)
def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    url = create_checkout_session(db, current_user)
    return {"checkout_url": url}

# Cancel subscription
@router.post("/cancel")
def cancel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return cancel_subscription(db, current_user)

# Stripe webhook
@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing stripe signature")
    return handle_webhook_event(db, payload, sig_header)