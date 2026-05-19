from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    price: Optional[float] = 0.0
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True

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