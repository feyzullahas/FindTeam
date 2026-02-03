from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import hashlib
import os
from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    # Split the stored hash into salt and hash
    parts = hashed_password.split('$')
    if len(parts) != 2:
        return False
    
    salt = bytes.fromhex(parts[0])
    stored_hash = parts[1]
    
    # Hash the provided password with the same salt
    new_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
    
    return new_hash.hex() == stored_hash

def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2"""
    # Generate a random salt
    salt = os.urandom(32)
    
    # Hash the password
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    
    # Return salt and hash separated by $
    return f"{salt.hex()}${pwd_hash.hex()}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
