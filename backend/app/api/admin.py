from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import require_admin
from app.models.user import User
from app.models.enrollment import Enrollment
from app.models.subscription import Subscription
from app.schemas.user import UserResponse
from app.schemas.enrollment import EnrollmentResponse
from app.schemas.subscription import SubscriptionResponse

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(User).all()

@router.get("/enrollments", response_model=List[EnrollmentResponse])
def get_all_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(Enrollment).all()

@router.get("/subscriptions", response_model=List[SubscriptionResponse])
def get_all_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(Subscription).all()