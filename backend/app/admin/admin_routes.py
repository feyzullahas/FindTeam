from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, EmailStr
from app.database.db import get_db
from app.users.user_model import User
from app.posts.post_model import Post
from app.lineups.lineup_model import Lineup
from app.users.user_schema import UserResponse
from app.posts.post_schema import PostResponse
from app.core.security import verify_token, create_access_token, verify_password, get_password_hash
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin")
admin_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/auth/login")


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_posts: int
    total_lineups: int


def _ensure_admin_user(db: Session, email: str, name_hint: str = "") -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=name_hint or email.split("@")[0], is_admin=True, role="admin")
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not user.is_admin:
            user.is_admin = True
        if not user.role or user.role != "admin":
            user.role = "admin"
        db.commit()
        db.refresh(user)
    return user


def admin_required(token: str = Depends(admin_oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(status_code=403, detail="Admin yetkisi gerekli")
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    email = payload.get("sub")
    role = payload.get("role")
    if not email or role != "admin":
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_admin:
        raise credentials_exception
    return user


@router.post("/auth/login")
async def admin_login(body: AdminLoginRequest, db: Session = Depends(get_db)):
    allowed_emails = [e.strip().lower() for e in (getattr(settings, "ADMIN_EMAILS", "") or "").split(",") if e.strip()]
    master_password = getattr(settings, "ADMIN_MASTER_PASSWORD", None)

    if allowed_emails and body.email.lower() not in allowed_emails:
        raise HTTPException(status_code=403, detail="Admin yetkisi yok")
    if not master_password:
        raise HTTPException(status_code=500, detail="Admin parolası yapılandırılmamış")
    if body.password != master_password:
        raise HTTPException(status_code=401, detail="Geçersiz kimlik bilgisi")

    user = _ensure_admin_user(db, body.email.lower())
    if not user.hashed_password:
        user.hashed_password = get_password_hash(master_password)
        db.commit()

    token = create_access_token({"sub": user.email, "user_id": user.id, "role": "admin", "is_admin": True})
    return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "is_admin": True, "id": user.id, "name": user.name, "role": user.role}}


@router.get("/stats", response_model=AdminStats)
async def get_stats(admin: User = Depends(admin_required), db: Session = Depends(get_db)):
    try:
        return AdminStats(
            total_users=db.query(User).count(),
            active_users=db.query(User).filter(User.is_active == True).count(),
            total_posts=db.query(Post).count(),
            total_lineups=db.query(Lineup).count(),
        )
    except Exception as e:
        logger.error(f"❌ Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail="İstatistikler yüklenirken hata")


# ============= KULLANICI YÖNETİMİ =============

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(admin: User = Depends(admin_required), db: Session = Depends(get_db)):
    logger.info(f"📋 Admin {admin.email} is fetching all users")
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []
    for u in users:
        try:
            positions = u.positions if isinstance(u.positions, list) else []
            result.append(UserResponse(
                id=u.id,
                email=u.email,
                name=u.name or "",
                phone=u.phone,
                city=u.city,
                age=u.age,
                positions=positions,
                is_verified=bool(u.is_verified),
                is_active=bool(u.is_active),
                is_admin=bool(u.is_admin),
                role=u.role or "user",
                created_at=u.created_at,
            ))
        except Exception as e:
            logger.warning(f"Skipping user {u.id} due to serialization error: {e}")
            continue
    return result


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, admin: User = Depends(admin_required), db: Session = Depends(get_db)):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Kendi hesabınızı silemezsiniz")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    db.query(Post).filter(Post.user_id == user_id).delete()
    db.query(Lineup).filter(Lineup.user_id == user_id).delete()
    db.delete(user)
    db.commit()
    return {"message": f"Kullanıcı {user.email} ve ilişkili veriler silindi"}


# ============= İLAN YÖNETİMİ =============

@router.get("/posts", response_model=List[PostResponse])
async def get_all_posts(admin: User = Depends(admin_required), db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.created_at.desc()).all()


@router.delete("/posts/{post_id}")
async def delete_post(post_id: int, admin: User = Depends(admin_required), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="İlan bulunamadı")
    db.delete(post)
    db.commit()
    return {"message": "İlan silindi"}
