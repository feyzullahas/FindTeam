from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.users.user_model import User
from app.users.user_schema import UserProfile, UserUpdate
from app.core.security import verify_token
import json

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        city=current_user.city,
        age=current_user.age,
        positions=current_user.positions or [],  # Veritabanından pozisyonları al
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = user_update.dict(exclude_unset=True)
    
    # Positions alanını veritabanına kaydet
    if "positions" in update_data:
        current_user.positions = update_data["positions"]
        del update_data["positions"]
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        city=current_user.city,
        age=current_user.age,
        positions=current_user.positions or [],  # Güncellenmiş pozisyonları döndür
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

@router.get("/search", response_model=List[UserProfile])
async def search_users(
    city: str = None,
    position: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(User)
    
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))
    
    if position:
        query = query.filter(User.positions.ilike(f"%{position}%"))
    
    users = query.all()
    
    result = []
    for user in users:
        positions = json.loads(user.positions) if user.positions else []
        result.append(UserProfile(
            id=user.id,
            email=user.email,
            name=user.name,
            phone=user.phone,
            city=user.city,
            age=user.age,
            positions=positions,
            is_verified=user.is_verified,
            created_at=user.created_at
        ))
    
    return result
