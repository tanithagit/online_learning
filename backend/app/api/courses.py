from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user, require_admin
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.services.course_service import (
    get_all_courses,
    get_course_by_id,
    create_course,
    update_course,
    delete_course
)
from app.models.user import User

router = APIRouter()

# Public - all logged in users can browse courses
@router.get("/", response_model=List[CourseResponse])
def list_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_courses(db)

# Public - get single course
@router.get("/{course_id}", response_model=CourseResponse)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_course_by_id(db, course_id)

# Admin only - create course
@router.post("/", response_model=CourseResponse)
def create_new_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return create_course(db, data, current_user.id)

# Admin only - update course
@router.put("/{course_id}", response_model=CourseResponse)
def update_existing_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return update_course(db, course_id, data)

# Admin only - delete course
@router.delete("/{course_id}")
def delete_existing_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return delete_course(db, course_id)