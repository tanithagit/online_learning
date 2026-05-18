from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse
from app.services.enrollment_service import (
    get_user_enrollments,
    enroll_user,
    unenroll_user
)
from app.models.user import User

router = APIRouter()

# Get my enrollments
@router.get("/my", response_model=List[EnrollmentResponse])
def my_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_enrollments(db, current_user.id)

# Enroll in a course
@router.post("/", response_model=EnrollmentResponse)
def enroll(
    data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return enroll_user(db, current_user.id, data.course_id)

# Unenroll from a course
@router.delete("/{enrollment_id}")
def unenroll(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return unenroll_user(db, current_user.id, enrollment_id)