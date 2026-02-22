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
        logger.info(f"➕ Creating lineup for user {current_user.id}: {lineup.name}")
        
        # Convert Pydantic model to dict (Pydantic v2)
        lineup_dict = lineup.model_dump()
        logger.info(f"📤 Lineup data: name='{lineup_dict['name']}', home_team_count={len(lineup_dict.get('home_team', []))}")
        
        # Veritabanı modeli oluştur
        db_lineup = Lineup(
            name=lineup_dict['name'],
            formation=lineup_dict['formation'],
            home_team=lineup_dict['home_team'],
            away_team=lineup_dict.get('away_team'),
            notes=lineup_dict.get('notes'),
            user_id=current_user.id
        )
        
        db.add(db_lineup)
        db.commit()
        db.refresh(db_lineup)
        
        logger.info(f"✅ Lineup created successfully with ID: {db_lineup.id}")
        return db_lineup
    except Exception as e:
        import traceback
        logger.error(f"❌ Error creating lineup: {str(e)}")
        logger.error(f"📋 Traceback:\n{traceback.format_exc()}")
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
        logger.info(f"🔄 Updating lineup {lineup_id} for user {current_user.id}")
        
        # 1. Veritabanından mevcut kadroyu bul
        db_lineup = db.query(Lineup).filter(
            Lineup.id == lineup_id,
            Lineup.user_id == current_user.id
        ).first()
        
        if not db_lineup:
            logger.error(f"❌ Lineup {lineup_id} not found for user {current_user.id}")
            raise HTTPException(status_code=404, detail="Kadro bulunamadı veya size ait değil")
        
        logger.info(f"📋 Found lineup: {db_lineup.name}")
        
        # 2. Pydantic modelini dict'e çevir - sadece gönderilen alanları al
        update_data = lineup_update.model_dump(exclude_unset=True, exclude_none=True)
        logger.info(f"📤 Update data received: {list(update_data.keys())}")
        
        # 3. Her alanı güncelle
        for field, value in update_data.items():
            if hasattr(db_lineup, field):
                logger.info(f"✏️ Updating {field} (type: {type(value).__name__})")
                setattr(db_lineup, field, value)
            else:
                logger.warning(f"⚠️ Skipping unknown field: {field}")
        
        # 4. Değişiklikleri kaydet
        try:
            db.commit()
            logger.info("💾 Changes committed to database successfully")
        except Exception as commit_error:
            logger.error(f"❌ Commit error: {commit_error}")
            db.rollback()
            raise
        
        # 5. Güncellenmiş veriyi yeniden yükle
        db.refresh(db_lineup)
        logger.info(f"✅ Lineup {lineup_id} updated successfully: {db_lineup.name}")
        
        return db_lineup
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        logger.error(f"❌ Error updating lineup {lineup_id}: {str(e)}")
        logger.error(f"📋 Traceback:\n{traceback.format_exc()}")
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
