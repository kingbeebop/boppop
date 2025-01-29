from typing import TYPE_CHECKING
from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .artist import Artist
    from .song import Song
    from .playlist import Playlist

class Review(Base, TimestampMixin):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("artists.id"), nullable=False)
    playlist_id = Column(Integer, ForeignKey("playlists.id"), nullable=False)

    # Relationships
    author = relationship("Artist", back_populates="reviews")
    song = relationship("Song", back_populates="reviews")
    playlist = relationship("Playlist", back_populates="reviews")