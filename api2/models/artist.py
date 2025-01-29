from typing import List, TYPE_CHECKING
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .user import User
    from .song import Song
    from .review import Review
    from .vote import Vote

class Artist(Base, TimestampMixin):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    bio = Column(String, nullable=True)
    profile_pic = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="artist")
    songs = relationship("Song", back_populates="artist")
    reviews = relationship("Review", back_populates="author")
    votes = relationship("Vote", back_populates="artist")