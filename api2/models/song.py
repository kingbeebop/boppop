from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import TimeStampedBase

class Song(TimeStampedBase):
    __tablename__ = "songs"

    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    artist_id = Column(Integer, ForeignKey("artists.id"))
    playlist_id = Column(Integer, ForeignKey("playlists.id"))
    
    # Relationships
    artist = relationship("Artist", back_populates="songs")
    playlist = relationship("Playlist", back_populates="songs")
    votes = relationship("Vote", back_populates="song")
    reviews = relationship("Review", back_populates="song") 