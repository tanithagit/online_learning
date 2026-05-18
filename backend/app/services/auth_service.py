from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from app.models.user import User, UserRole
from app.models.subscription import Subscription, PlanType, SubscriptionStatus
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.schemas.user import UserRegister

def register_user(db: Session, data: UserRegister) -> User:
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    new_user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        role=UserRole.user,
        is_active=True
    )
    db.add(new_user)
    db.flush()

    # Create free subscription for new user
    subscription = Subscription(
        user_id=new_user.id,
        plan=PlanType.free,
        status=SubscriptionStatus.active
    )
    db.add(subscription)
    db.commit()
    db.refresh(new_user)
    return new_user

def login_user(db: Session, email: str, password: str) -> dict:
    # Find user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )

    # Create token
    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.value
        },
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }