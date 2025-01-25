from typing import List, TYPE_CHECKING
from datetime import date as date_type
from sqlalchemy import String, Integer, Date, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import TimeStampedBase
from .playlist_songs import playlist_songs

if TYPE_CHECKING:
    from .song import Song
    from .review import Review
    from .vote import Vote

class Playlist(TimeStampedBase):
    __tablename__ = "playlists"

    # Columns
    number: Mapped[int] = mapped_column(Integer, unique=True)
    theme: Mapped[str] = mapped_column(String(length=200))
    date: Mapped[date_type] = mapped_column(Date)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    contest: Mapped[bool] = mapped_column(Boolean, default=False)
    winner_id: Mapped[int | None] = mapped_column(ForeignKey("songs.id"))
    
    # Relationships
    songs: Mapped[List["Song"]] = relationship(
        secondary=playlist_songs,
        back_populates="playlists"
    )
    winner: Mapped["Song | None"] = relationship(
        foreign_keys=[winner_id],
        post_update=True
    )
    reviews: Mapped[List["Review"]] = relationship(back_populates="playlist")
    votes: Mapped[List["Vote"]] = relationship(back_populates="playlist")

    def __repr__(self):
        return f"<Playlist(number={self.number}, theme={self.theme})>"
