from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.db import get_db
from app.posts.post_model import Post
from app.posts.post_schema import PostCreate, PostResponse, PostList, PostUpdate
from app.users.user_model import User
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordBearer
import json

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from fastapi import HTTPException
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

@router.post("/", response_model=PostResponse)
async def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post_data = post.dict()
    
    # Handle positions_needed
    if post_data.get("positions_needed") and len(post_data["positions_needed"]) > 0:
        post_data["positions_needed"] = json.dumps(post_data["positions_needed"])
    else:
        post_data["positions_needed"] = None
    
    # Handle contact_info
    if post_data.get("contact_info"):
        # contact_info zaten JSON formatında, doğrudan kullan
        pass
    
    db_post = Post(**post_data, user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Get user name for response
    user_name = db.query(User.name).filter(User.id == current_user.id).scalar()
    
    positions_needed = json.loads(db_post.positions_needed) if db_post.positions_needed else []
    
    return PostResponse(
        id=db_post.id,
        title=db_post.title,
        description=db_post.description,
        post_type=db_post.post_type,
        city=db_post.city,
        positions_needed=positions_needed,
        contact_info=db_post.contact_info,
        match_time=db_post.match_time,
        venue=db_post.venue,
        user_id=db_post.user_id,
        status=db_post.status,
        views_count=db_post.views_count,
        created_at=db_post.created_at,
        user_name=user_name
    )

@router.get("/", response_model=PostList)
async def get_posts(
    city: Optional[str] = Query(None),
    post_type: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Post).join(User)
    
    if city:
        query = query.filter(Post.city.ilike(f"%{city}%"))
    
    if post_type:
        query = query.filter(Post.post_type == post_type)
    
    if position:
        query = query.filter(Post.positions_needed.ilike(f"%{position}%"))
    
    # Sadece aktif ilanları göster
    query = query.filter(Post.status == "active")
    
    total = query.count()
    posts = query.offset(skip).limit(limit).all()
    
    result = []
    for post in posts:
        positions_needed = json.loads(post.positions_needed) if post.positions_needed else []
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            description=post.description,
            post_type=post.post_type,
            city=post.city,
            positions_needed=positions_needed,
            contact_info=post.contact_info,
            match_time=post.match_time,
            venue=post.venue,
            user_id=post.user_id,
            status=post.status,
            views_count=post.views_count,
            created_at=post.created_at,
            user_name=post.user.name if post.user else None
        ))
    
    return PostList(posts=result, total=total)

@router.get("/my", response_model=List[PostResponse])
async def get_my_posts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    posts = db.query(Post).filter(Post.user_id == current_user.id).all()
    
    result = []
    for post in posts:
        positions_needed = json.loads(post.positions_needed) if post.positions_needed else []
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            description=post.description,
            post_type=post.post_type,
            city=post.city,
            positions_needed=positions_needed,
            contact_info=post.contact_info,
            match_time=post.match_time,
            venue=post.venue,
            user_id=post.user_id,
            status=post.status,
            views_count=post.views_count,
            created_at=post.created_at,
            user_name=current_user.name
        ))
    
    return result

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_data = post_update.dict(exclude_unset=True)
    
    if "positions_needed" in update_data:
        if update_data["positions_needed"] and len(update_data["positions_needed"]) > 0:
            update_data["positions_needed"] = json.dumps(update_data["positions_needed"])
        else:
            update_data["positions_needed"] = None
    
    for field, value in update_data.items():
        setattr(db_post, field, value)
    
    db.commit()
    db.refresh(db_post)
    
    positions_needed = json.loads(db_post.positions_needed) if db_post.positions_needed else []
    
    return PostResponse(
        id=db_post.id,
        title=db_post.title,
        description=db_post.description,
        post_type=db_post.post_type,
        city=db_post.city,
        positions_needed=positions_needed,
        contact_info=db_post.contact_info,
        match_time=db_post.match_time,
        venue=db_post.venue,
        user_id=db_post.user_id,
        status=db_post.status,
        views_count=db_post.views_count,
        created_at=db_post.created_at,
        user_name=current_user.name
    )

@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.delete(db_post)
    db.commit()
    
    return {"message": "Post deleted successfully"}
