from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.users.user_model import User
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordBearer
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Mevcut kullanıcıyı getir"""
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

@router.post("/make-me-admin")
async def make_me_admin(
    secret_key: str = Header(None, alias="X-Admin-Secret"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    İlk admin kullanıcısını oluşturmak için özel endpoint
    X-Admin-Secret header'ı ile korunur
    
    Kullanım:
    curl -X POST http://localhost:8000/setup/make-me-admin \
      -H "Authorization: Bearer YOUR_TOKEN" \
      -H "X-Admin-Secret: FIRST_ADMIN_SECRET_2024"
    """
    # Secret key kontrolü (basit güvenlik)
    EXPECTED_SECRET = "FIRST_ADMIN_SECRET_2024"
    
    if secret_key != EXPECTED_SECRET:
        logger.warning(f"⚠️ Invalid secret key from {current_user.email}")
        raise HTTPException(
            status_code=403,
            detail="Geçersiz secret key"
        )
    
    # Kullanıcıyı admin yap
    current_user.is_admin = True
    db.commit()
    db.refresh(current_user)
    
    logger.info(f"✅ {current_user.email} admin yapıldı (setup endpoint)")
    
    return {
        "message": "Başarıyla admin yapıldınız!",
        "user": {
            "email": current_user.email,
            "name": current_user.name,
            "is_admin": current_user.is_admin
        }
    }

