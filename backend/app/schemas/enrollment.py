from pydantic import BaseModel
from datetime import datetime
from app.schemas.course import CourseResponse

class EnrollmentCreate(BaseModel):
    course_id: int

class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    enrolled_at: datetime
    course: CourseResponse

    class Config:
        from_attributes = True