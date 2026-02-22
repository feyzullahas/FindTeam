from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = None
    positions: Optional[List[str]] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = None
    positions: Optional[List[str]] = None

class UserResponse(UserBase):
    id: int
    is_verified: bool
    is_admin: bool = False
    role: str = "user"
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfile(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = None
    positions: Optional[List[str]] = None
    is_verified: bool
    is_admin: bool = False
    role: str = "user"
    created_at: datetime
    
    class Config:
        from_attributes = True
