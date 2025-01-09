from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from .base import TimeStampedBase

class Artist(TimeStampedBase):
    __tablename__ = "artists"

    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    bio = Column(String, nullable=True)
    profile_pic = Column(String, nullable=True)
    
    # Relationships
    songs = relationship("Song", back_populates="artist")
    votes = relationship("Vote", back_populates="artist")
    reviews = relationship("Review", back_populates="artist") 