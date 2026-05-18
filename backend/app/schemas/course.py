from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: Optional[float] = 0.0

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None

class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    price: Optional[float] = 0.0
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True