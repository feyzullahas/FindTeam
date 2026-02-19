from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.lineups.lineup_model import Lineup
from app.lineups.lineup_schema import LineupCreate, LineupResponse, LineupList, LineupUpdate
from app.users.user_model import User
from app.core.security import verify_token
from fastapi.security import OAuth2PasswordBearer
import logging

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

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
    try:
        logger.info(f"Creating lineup for user {current_user.id}: {lineup.name}")
        logger.info(f"Lineup data: {lineup.dict()}")
        
        # Convert Pydantic models to dict for JSON storage
        lineup_dict = lineup.dict()
        home_team_list = [player.dict() for player in lineup.home_team]
        away_team_list = [player.dict() for player in lineup.away_team] if lineup.away_team else None
        
        db_lineup = Lineup(
            name=lineup_dict['name'],
            formation=lineup_dict['formation'],
            home_team=home_team_list,
            away_team=away_team_list,
            notes=lineup_dict.get('notes'),
            user_id=current_user.id
        )
        
        db.add(db_lineup)
        db.commit()
        db.refresh(db_lineup)
        
        logger.info(f"✅ Lineup created successfully with ID: {db_lineup.id}")
        return db_lineup
    except Exception as e:
        logger.error(f"❌ Error creating lineup: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Kadro oluşturulurken hata: {str(e)}")

@router.get("/", response_model=LineupList)
async def get_lineups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Kullanıcının tüm kadro dizilişlerini getir"""
    try:
        logger.info(f"Fetching lineups for user {current_user.id}")
        lineups = db.query(Lineup).filter(Lineup.user_id == current_user.id).order_by(Lineup.created_at.desc()).all()
        logger.info(f"✅ Found {len(lineups)} lineups for user {current_user.id}")
        return LineupList(lineups=lineups, total=len(lineups))
    except Exception as e:
        logger.error(f"❌ Error fetching lineups: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Kadrolar yüklenirken hata: {str(e)}")

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
    try:
        logger.info(f"Updating lineup {lineup_id} for user {current_user.id}")
        
        db_lineup = db.query(Lineup).filter(
            Lineup.id == lineup_id,
            Lineup.user_id == current_user.id
        ).first()
        
        if not db_lineup:
            raise HTTPException(status_code=404, detail="Kadro bulunamadı")
        
        update_data = lineup_update.dict(exclude_unset=True)
        
        # Convert Player models to dict if present
        if 'home_team' in update_data and update_data['home_team']:
            update_data['home_team'] = [player.dict() for player in update_data['home_team']]
        if 'away_team' in update_data and update_data['away_team']:
            update_data['away_team'] = [player.dict() for player in update_data['away_team']]
        
        for field, value in update_data.items():
            setattr(db_lineup, field, value)
        
        db.commit()
        db.refresh(db_lineup)
        
        logger.info(f"✅ Lineup {lineup_id} updated successfully")
        return db_lineup
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating lineup: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Kadro güncellenirken hata: {str(e)}")

@router.delete("/{lineup_id}")
async def delete_lineup(
    lineup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Kadro dizilişini sil"""
    try:
        logger.info(f"Deleting lineup {lineup_id} for user {current_user.id}")
        
        db_lineup = db.query(Lineup).filter(
            Lineup.id == lineup_id,
            Lineup.user_id == current_user.id
        ).first()
        
        if not db_lineup:
            raise HTTPException(status_code=404, detail="Kadro bulunamadı")
        
        db.delete(db_lineup)
        db.commit()
        
        logger.info(f"✅ Lineup {lineup_id} deleted successfully")
        return {"message": "Kadro başarıyla silindi"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting lineup: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Kadro silinirken hata: {str(e)}")
