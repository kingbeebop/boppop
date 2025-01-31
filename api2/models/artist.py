from typing import List, TYPE_CHECKING
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

if TYPE_CHECKING:
    from .user import User
    from .song import Song
    from .review import Review
    from .vote import Vote

class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    bio = Column(String, nullable=True)
    profile_pic = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="artist")
    songs = relationship("Song", back_populates="artist")
    reviews = relationship("Review", back_populates="author")
    votes = relationship("Vote", back_populates="artist")