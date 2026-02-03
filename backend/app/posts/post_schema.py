from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class PostBase(BaseModel):
    title: str
    description: Optional[str] = None
    post_type: str  # "team" or "player"
    city: str
    positions_needed: Optional[List[str]] = None
    contact_info: Dict[str, str]  # {"phone": "...", "email": "..."}
    match_time: Optional[str] = None  # "18:00-20:00" formatında saat aralığı
    venue: Optional[str] = None  # Saha adı/yeri

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    city: Optional[str] = None
    positions_needed: Optional[List[str]] = None
    contact_info: Optional[Dict[str, str]] = None
    match_time: Optional[str] = None
    venue: Optional[str] = None
    status: Optional[str] = None

class PostResponse(PostBase):
    id: int
    user_id: int
    status: str
    views_count: int
    created_at: datetime
    user_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class PostList(BaseModel):
    posts: List[PostResponse]
    total: int
