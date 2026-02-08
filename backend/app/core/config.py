from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "https://findteam.onrender.com/auth/google/callback"
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 gün
    
    # Frontend URL
    FRONTEND_URL: str = "https://findteam-ten.vercel.app"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Güvenlik kontrolü
def validate_settings():
    """Gerekli environment variable'ların varlığını kontrol et"""
    required_vars = [
        "DATABASE_URL",
        "GOOGLE_CLIENT_ID", 
        "GOOGLE_CLIENT_SECRET",
        "SECRET_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not getattr(settings, var, None):
            missing_vars.append(var)
    
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    # Production'da zayıf secret key kontrolü
    if settings.ENVIRONMENT == "production" and settings.SECRET_KEY == "your-super-secret-key-here-change-this-in-production":
        raise ValueError("Please change SECRET_KEY in production environment")

# Başlangıçta kontrol et
validate_settings()
