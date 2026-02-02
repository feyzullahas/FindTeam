from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    post_type = Column(String(20), nullable=False)  # "team" or "player"
    city = Column(String(100), nullable=False)
    positions_needed = Column(Text, nullable=True)  # JSON string of positions
    contact_info = Column(JSON, nullable=False)  # {"phone": "...", "email": "..."}
    match_time = Column(String(50), nullable=True)  # "18:00-20:00" formatında saat aralığı
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(10), default="active")  # "active", "closed", "expired"
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="posts")
    
    def __repr__(self):
        return f"<Post(id={self.id}, title={self.title}, user_id={self.user_id})>"
