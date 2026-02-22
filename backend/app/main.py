from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.auth.auth_routes import router as auth_router
from app.users.user_routes import router as user_router
from app.posts.post_routes import router as post_router
from app.lineups.lineup_routes import router as lineup_router
from app.admin import router as admin_router
from app.core.config import settings
from datetime import datetime
import os

# Database models
from app.database.base import Base
from app.database.db import engine
from app.users.user_model import User
from app.posts.post_model import Post
from app.lineups.lineup_model import Lineup
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Disable Swagger docs in production for security
# Access via /docs will return 404 in production
if settings.ENVIRONMENT == "production":
    app = FastAPI(
        title="FindTeam API",
        docs_url=None,  # Disable /docs
        redoc_url=None,  # Disable /redoc
        openapi_url=None  # Disable /openapi.json
    )
else:
    app = FastAPI(title="FindTeam API")

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    """Create all database tables when the application starts"""
    try:
        logger.info("🚀 Starting application...")
        logger.info("📊 Creating database tables...")
        
        # List all tables that will be created
        tables = Base.metadata.tables.keys()
        logger.info(f"📋 Tables to create/verify: {list(tables)}")
        
        Base.metadata.create_all(bind=engine)
        
        logger.info("✅ Database tables created/verified successfully")
        logger.info(f"✅ Tables: {', '.join(tables)}")
    except Exception as e:
        logger.error(f"❌ Error creating database tables: {e}")
        import traceback
        logger.error(traceback.format_exc())

# Restrict CORS to specific frontend domain only
# CRITICAL SECURITY: Never use allow_origins=["*"] in production
allowed_origins = [
    settings.FRONTEND_URL,  # Production frontend
    "https://findteam-ten.vercel.app",  # Explicit production URL
    "http://localhost:3000",  # Local development
    "http://localhost:5173",  # Vite dev server
]

# Only allow all origins in development
if settings.ENVIRONMENT == "development":
    allowed_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Add trusted host middleware to prevent host header attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "findteam.onrender.com",
        "localhost",
        "127.0.0.1",
        "*.vercel.app"
    ]
)

# Trust proxy headers (Critical for Render/Heroku HTTPS)
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])

# Add security middleware
from app.middleware.security import RateLimitMiddleware, SecurityHeadersMiddleware

# Rate limiting: 100 requests per minute per IP
app.add_middleware(RateLimitMiddleware, requests_per_minute=100)

# Security headers
app.add_middleware(SecurityHeadersMiddleware)

# Include routers
app.include_router(auth_router, tags=["auth"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(post_router, prefix="/posts", tags=["posts"])
app.include_router(lineup_router, prefix="/lineups", tags=["lineups"])
app.include_router(admin_router, tags=["admin"])

@app.get("/")
def root():
    return {"status": "API çalışıyor"}

@app.get("/health")
def health_check():
    """Health check endpoint for uptime monitoring"""
    return {
        "status": "healthy",
        "service": "FindTeam API",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/ping")
def ping():
    """Simple ping endpoint to keep Render awake"""
    return {"pong": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)