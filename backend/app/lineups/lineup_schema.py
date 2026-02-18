from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Player(BaseModel):
    name: str
    x: float  # X koordinatı (0-100 arası yüzde)
    y: float  # Y koordinatı (0-100 arası yüzde)

class LineupBase(BaseModel):
    name: str
    formation: str = "7v7"
    home_team: List[Player]  # Maksimum 7 oyuncu
    away_team: Optional[List[Player]] = None  # Karşı takım (opsiyonel)
    notes: Optional[str] = None

class LineupCreate(LineupBase):
    pass

class LineupUpdate(BaseModel):
    name: Optional[str] = None
    formation: Optional[str] = None
    home_team: Optional[List[Player]] = None
    away_team: Optional[List[Player]] = None
    notes: Optional[str] = None

class LineupResponse(LineupBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class LineupList(BaseModel):
    lineups: list[LineupResponse]
    total: int
