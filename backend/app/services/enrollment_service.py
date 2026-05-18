from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.enrollment import Enrollment
from app.models.subscription import Subscription, PlanType
from app.models.user import User

FREE_PLAN_LIMIT = 2

def get_user_enrollments(db: Session, user_id: int):
    return db.query(Enrollment).filter(
        Enrollment.user_id == user_id
    ).all()

def enroll_user(db: Session, user_id: int, course_id: int):
    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this course"
        )

    # Get user subscription
    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).first()

    # Check enrollment limit for free plan
    if not subscription or subscription.plan == PlanType.free:
        enrollment_count = db.query(Enrollment).filter(
            Enrollment.user_id == user_id
        ).count()
        if enrollment_count >= FREE_PLAN_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Free plan allows maximum {FREE_PLAN_LIMIT} enrollments. Please upgrade to Pro."
            )

    # Create enrollment
    enrollment = Enrollment(
        user_id=user_id,
        course_id=course_id
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

def unenroll_user(db: Session, user_id: int, enrollment_id: int):
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.user_id == user_id
    ).first()
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )
    db.delete(enrollment)
    db.commit()
    return {"message": "Unenrolled successfully"}