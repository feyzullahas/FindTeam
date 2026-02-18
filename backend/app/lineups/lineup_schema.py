from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class LineupBase(BaseModel):
    name: str
    formation: str = "3-3-1"
    home_team: Dict[str, str]  # {"gk": "Ali", "def1": "Mehmet", ...}
    away_team: Optional[Dict[str, str]] = None
    notes: Optional[str] = None

class LineupCreate(LineupBase):
    pass

class LineupUpdate(BaseModel):
    name: Optional[str] = None
    formation: Optional[str] = None
    home_team: Optional[Dict[str, str]] = None
    away_team: Optional[Dict[str, str]] = None
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
