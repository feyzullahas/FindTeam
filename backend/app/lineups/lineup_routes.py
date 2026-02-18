from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.lineups.lineup_model import Lineup
from app.lineups.lineup_schema import LineupCreate, LineupResponse, LineupList, LineupUpdate
from app.users.user_model import User
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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

@router.post("/", response_model=LineupResponse)
async def create_lineup(
    lineup: LineupCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Yeni kadro dizilişi oluştur"""
    db_lineup = Lineup(**lineup.dict(), user_id=current_user.id)
    db.add(db_lineup)
    db.commit()
    db.refresh(db_lineup)
    return db_lineup

@router.get("/", response_model=LineupList)
async def get_lineups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Kullanıcının tüm kadro dizilişlerini getir"""
    lineups = db.query(Lineup).filter(Lineup.user_id == current_user.id).order_by(Lineup.created_at.desc()).all()
    return LineupList(lineups=lineups, total=len(lineups))

@router.get("/{lineup_id}", response_model=LineupResponse)
async def get_lineup(
    lineup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Belirli bir kadro dizilişini getir"""
    lineup = db.query(Lineup).filter(
        Lineup.id == lineup_id,
        Lineup.user_id == current_user.id
    ).first()
    
    if not lineup:
        raise HTTPException(status_code=404, detail="Kadro bulunamadı")
    
    return lineup

@router.put("/{lineup_id}", response_model=LineupResponse)
async def update_lineup(
    lineup_id: int,
    lineup_update: LineupUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Kadro dizilişini güncelle"""
    db_lineup = db.query(Lineup).filter(
        Lineup.id == lineup_id,
        Lineup.user_id == current_user.id
    ).first()
    
    if not db_lineup:
        raise HTTPException(status_code=404, detail="Kadro bulunamadı")
    
    update_data = lineup_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_lineup, field, value)
    
    db.commit()
    db.refresh(db_lineup)
    return db_lineup

@router.delete("/{lineup_id}")
async def delete_lineup(
    lineup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Kadro dizilişini sil"""
    db_lineup = db.query(Lineup).filter(
        Lineup.id == lineup_id,
        Lineup.user_id == current_user.id
    ).first()
    
    if not db_lineup:
        raise HTTPException(status_code=404, detail="Kadro bulunamadı")
    
    db.delete(db_lineup)
    db.commit()
    return {"message": "Kadro başarıyla silindi"}
