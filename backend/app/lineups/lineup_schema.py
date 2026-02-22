from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class Player(BaseModel):
    name: str
    x: float  # X koordinatı (0-100 arası yüzde)
    y: float  # Y koordinatı (0-100 arası yüzde)
    
    model_config = {
        "from_attributes": True
    }

class LineupBase(BaseModel):
    name: str
    formation: str = "7v7"
    home_team: List[Dict[str, Any]]  # List of player dicts
    away_team: Optional[List[Dict[str, Any]]] = None  # List of player dicts
    notes: Optional[str] = None

class LineupCreate(BaseModel):
    name: str
    formation: str = "7v7"
    home_team: List[Dict[str, Any]]  # Accept dicts directly from frontend
    away_team: Optional[List[Dict[str, Any]]] = None
    notes: Optional[str] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Cumartesi Maçı",
                "formation": "7v7",
                "home_team": [{"name": "Ali", "x": 50.0, "y": 30.0}],
                "away_team": None,
                "notes": "İyi oyun"
            }
        }
    }

class LineupUpdate(BaseModel):
    name: Optional[str] = None
    formation: Optional[str] = None
    home_team: Optional[List[Dict[str, Any]]] = None  # Accept dicts directly
    away_team: Optional[List[Dict[str, Any]]] = None
    notes: Optional[str] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Pazar Maçı",
                "home_team": [{"name": "Mehmet", "x": 60.0, "y": 40.0}]
            }
        }
    }

class LineupResponse(LineupBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {
        "from_attributes": True
    }

class LineupList(BaseModel):
    lineups: list[LineupResponse]
    total: int
