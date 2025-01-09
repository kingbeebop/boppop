from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base import TimeStampedBase

class Vote(TimeStampedBase):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint('artist_id', 'playlist_id', name='unique_artist_playlist_vote'),
    )

    song_id = Column(Integer, ForeignKey("songs.id"))
    artist_id = Column(Integer, ForeignKey("artists.id"))
    playlist_id = Column(Integer, ForeignKey("playlists.id"))
    
    # Relationships
    song = relationship("Song", back_populates="votes")
    artist = relationship("Artist", back_populates="votes")
    playlist = relationship("Playlist") 