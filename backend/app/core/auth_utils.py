"""
Enhanced authentication and authorization utilities
Provides additional security layers beyond basic JWT validation
"""
from fastapi import HTTPException, Depends, Request
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.users.user_model import User
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordBearer
from functools import wraps
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user_enhanced(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    request: Request = None
) -> User:
    """
    Enhanced user authentication with additional security checks
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify token
    payload = verify_token(token)
    if payload is None:
        logger.warning(f"Invalid token attempt from IP: {request.client.host if request else 'unknown'}")
        raise credentials_exception
    
    # Extract user email
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    # Get user from database
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        logger.warning(f"Token for non-existent user: {email}")
        raise credentials_exception
    
    # Check if user is active
    if hasattr(user, 'is_active') and not user.is_active:
        raise HTTPException(status_code=403, detail="User account is disabled")
    
    # Optional: Check token's user_id matches database user_id
    token_user_id = payload.get("user_id")
    if token_user_id and token_user_id != user.id:
        logger.error(f"Token user_id mismatch: token={token_user_id}, db={user.id}")
        raise credentials_exception
    
    # Log successful authentication (optional, for audit trail)
    # Be careful with logging in production - don't log sensitive data
    if request:
        logger.info(f"User {user.id} authenticated from IP: {request.client.host}")
    
    return user


def require_ownership(model_class, id_field: str = "id"):
    """
    Decorator to ensure user owns the resource they're trying to access
    
    Usage:
        @require_ownership(Post, "post_id")
        async def update_post(post_id: int, current_user: User = Depends(get_current_user)):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get current_user from kwargs
            current_user = kwargs.get("current_user")
            if not current_user:
                raise HTTPException(status_code=401, detail="Authentication required")
            
            # Get resource ID from kwargs
            resource_id = kwargs.get(id_field)
            if resource_id is None:
                raise HTTPException(status_code=400, detail=f"Missing {id_field}")
            
            # Get database session
            db = kwargs.get("db")
            if not db:
                raise HTTPException(status_code=500, detail="Database session not available")
            
            # Check ownership
            resource = db.query(model_class).filter(
                getattr(model_class, id_field.replace("_id", "")) == resource_id,
                model_class.user_id == current_user.id
            ).first()
            
            if not resource:
                raise HTTPException(
                    status_code=404,
                    detail=f"{model_class.__name__} not found or access denied"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


class RoleChecker:
    """
    Check if user has required role
    
    Usage:
        @router.post("/admin/users")
        async def create_user(current_user: User = Depends(RoleChecker(["admin"]))):
            ...
    """
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: User = Depends(get_current_user_enhanced)):
        if not hasattr(current_user, 'role'):
            raise HTTPException(
                status_code=403,
                detail="User role not configured"
            )
        
        if current_user.role not in self.allowed_roles:
            logger.warning(
                f"Access denied for user {current_user.id} "
                f"(role: {current_user.role}, required: {self.allowed_roles})"
            )
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )
        
        return current_user


def log_sensitive_operation(operation: str):
    """
    Decorator to log sensitive operations for audit trail
    
    Usage:
        @log_sensitive_operation("delete_post")
        async def delete_post(post_id: int, current_user: User):
            ...
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            user_id = current_user.id if current_user else "unknown"
            
            logger.info(
                f"AUDIT: Operation '{operation}' by user_id={user_id} "
                f"at {datetime.utcnow().isoformat()}"
            )
            
            try:
                result = await func(*args, **kwargs)
                logger.info(f"AUDIT: Operation '{operation}' completed successfully")
                return result
            except Exception as e:
                logger.error(f"AUDIT: Operation '{operation}' failed: {str(e)}")
                raise
        
        return wrapper
    return decorator
