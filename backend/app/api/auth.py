from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import register_user, login_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    user = register_user(db, data)
    result = login_user(db, data.email, data.password)
    return result

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    result = login_user(db, data.email, data.password)
    return result

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user