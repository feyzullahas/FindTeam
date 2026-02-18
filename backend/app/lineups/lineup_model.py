from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class Lineup(Base):
    __tablename__ = "lineups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # Kadro adı (örn: "Cumartesi Maçı")
    formation = Column(String(20), default="3-3-1")  # 3 defans, 3 forvet, 1 kaleci
    home_team = Column(JSON, nullable=False)  # {"gk": "name", "def1": "name", ...}
    away_team = Column(JSON, nullable=True)  # Karşı takım (opsiyonel)
    notes = Column(Text, nullable=True)  # Notlar
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="lineups")
    
    def __repr__(self):
        return f"<Lineup(id={self.id}, name={self.name}, user_id={self.user_id})>"
