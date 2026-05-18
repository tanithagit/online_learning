from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate

def get_all_courses(db: Session):
    return db.query(Course).all()

def get_course_by_id(db: Session, course_id: int):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return course

def create_course(db: Session, data: CourseCreate, admin_id: int):
    course = Course(
        title=data.title,
        description=data.description,
        price=data.price,
        created_by=admin_id
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def update_course(db: Session, course_id: int, data: CourseUpdate):
    course = get_course_by_id(db, course_id)
    if data.title is not None:
        course.title = data.title
    if data.description is not None:
        course.description = data.description
    if data.price is not None:
        course.price = data.price
    db.commit()
    db.refresh(course)
    return course

def delete_course(db: Session, course_id: int):
    course = get_course_by_id(db, course_id)
    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}