from sqlalchemy import Column, String, Integer, Date, Boolean
from sqlalchemy.orm import relationship
from .base import TimeStampedBase

class Playlist(TimeStampedBase):
    __tablename__ = "playlists"

    number = Column(Integer, unique=True, nullable=False)
    theme = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    active = Column(Boolean, default=True)
    contest = Column(Boolean, default=False)
    winner_id = Column(Integer, ForeignKey("songs.id"), nullable=True)
    
    # Relationships
    songs = relationship("Song", back_populates="playlist")
    winner = relationship("Song", foreign_keys=[winner_id]) 