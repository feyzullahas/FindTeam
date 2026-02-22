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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 180  # 3 saat
    
    # Frontend URL
    FRONTEND_URL: str = "https://findteam-ten.vercel.app"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Admin
    ADMIN_EMAILS: str = ""           # comma-separated allowed admin emails
    ADMIN_MASTER_PASSWORD: str = ""  # master password for admin login
    
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
    weak_keys = [
        "your-super-secret-key-here-change-this-in-production",
        "secret",
        "test",
        "development",
        "changeme",
        "secret-key"
    ]
    
    if settings.ENVIRONMENT == "production":
        # Check for weak/default keys
        if settings.SECRET_KEY.lower() in weak_keys:
            raise ValueError("SECURITY ERROR: Please change SECRET_KEY to a strong random value in production")
        
        # Check minimum key length (should be at least 32 characters)
        if len(settings.SECRET_KEY) < 32:
            raise ValueError("SECURITY ERROR: SECRET_KEY must be at least 32 characters long in production")
        
        print("✅ Security validation passed: Strong SECRET_KEY detected")

# Başlangıçta kontrol et
validate_settings()
