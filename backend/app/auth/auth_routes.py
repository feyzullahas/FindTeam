from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.auth.google_oauth import google_oauth
from app.database.db import get_db
from app.users.user_model import User
from app.core.security import create_access_token
import json
import urllib.parse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/google/login")
def google_login():
    url = google_oauth.get_login_url()
    return RedirectResponse(url)

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code bulunamadı")

    try:
        # 1. Access token al
        token_data = await google_oauth.get_access_token(code)
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="Access token alınamadı")

        # 2. Kullanıcı bilgilerini çek
        user_info = await google_oauth.get_user_info(access_token)
        
        # 3. Veritabanında kullanıcıyı kontrol et/yarat
        user = db.query(User).filter(User.email == user_info["email"]).first()
        
        if not user:
            # Yeni kullanıcı oluştur
            user = User(
                email=user_info["email"],
                name=user_info.get("name", ""),
                google_id=user_info.get("id"),
                is_verified=user_info.get("verified_email", False)
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ Yeni kullanıcı oluşturuldu: {user.email}")
        else:
            # Mevcut kullanıcıyı güncelle (gerekirse)
            if not user.google_id:
                user.google_id = user_info.get("id")
            if not user.name and user_info.get("name"):
                user.name = user_info["name"]
            if not user.is_verified and user_info.get("verified_email"):
                user.is_verified = True
            db.commit()
            print(f"🔄 Mevcut kullanıcı güncellendi: {user.email}")

        # 4. JWT token oluştur
        jwt_token = create_access_token(data={"sub": user.email, "user_id": user.id})
        
        # 5. Frontend'e yönlendir
        user_data = {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "is_verified": user.is_verified
        }
        
        user_json = urllib.parse.quote(json.dumps(user_data))
        
        # JWT token'ı da query param olarak gönder
        return RedirectResponse(
            url=f"http://localhost:3002/auth-success?user={user_json}&token={jwt_token}"
        )

    except Exception as e:
        print(f"❌ Google callback hatası: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Authentication hatası: {str(e)}"
        )