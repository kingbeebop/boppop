from typing import List, TYPE_CHECKING
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import TimeStampedBase
from .playlist_songs import playlist_songs

if TYPE_CHECKING:
    from .artist import Artist
    from .playlist import Playlist
    from .review import Review
    from .vote import Vote

class Song(TimeStampedBase):
    __tablename__ = "songs"
    
    # Columns
    title: Mapped[str] = mapped_column(String(length=200))
    url: Mapped[str] = mapped_column(String(length=500))
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"))
    
    # Relationships
    artist: Mapped["Artist"] = relationship(back_populates="songs")
    playlists: Mapped[List["Playlist"]] = relationship(
        secondary=playlist_songs,
        back_populates="songs"
    )
    reviews: Mapped[List["Review"]] = relationship(back_populates="song")
    votes: Mapped[List["Vote"]] = relationship(back_populates="song")

    def __repr__(self):
        return f"<Song(title={self.title}, url={self.url})>"
