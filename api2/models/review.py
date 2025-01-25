from typing import TYPE_CHECKING
from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import TimeStampedBase

if TYPE_CHECKING:
    from .song import Song
    from .artist import Artist
    from .playlist import Playlist

class Review(TimeStampedBase):
    __tablename__ = "reviews"

    # Columns
    content: Mapped[str] = mapped_column(Text)
    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("artists.id"))
    playlist_id: Mapped[int] = mapped_column(ForeignKey("playlists.id"))
    
    # Relationships
    song: Mapped["Song"] = relationship(back_populates="reviews")
    author: Mapped["Artist"] = relationship(back_populates="written_reviews")
    playlist: Mapped["Playlist"] = relationship(back_populates="reviews")