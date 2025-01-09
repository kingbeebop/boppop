from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import TimeStampedBase

class Review(TimeStampedBase):
    __tablename__ = "reviews"

    content = Column(Text, nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"))
    artist_id = Column(Integer, ForeignKey("artists.id"))
    
    # Relationships
    song = relationship("Song", back_populates="reviews")
    artist = relationship("Artist", back_populates="reviews") 