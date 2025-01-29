from typing import Optional, List
from datetime import datetime, date
from strawberry import type as strawberry_type
from strawberry.types import Info
from strawberry.scalars import ID
import strawberry
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from db.session import AsyncSessionLocal
from models.playlist import Playlist as PlaylistModel
from .song import Song
from schemas.utils import encode_cursor, decode_cursor

@strawberry.input
class PlaylistFilter:
    theme: Optional[str] = strawberry.field(default=None)
    active: Optional[bool] = strawberry.field(default=None)
    contest: Optional[bool] = strawberry.field(default=None)

@strawberry_type
class PlaylistEdge:
    node: "Playlist"
    cursor: str

@strawberry_type
class PageInfo:
    hasNextPage: bool
    hasPreviousPage: bool
    startCursor: Optional[str]
    endCursor: Optional[str]

@strawberry_type
class PlaylistConnection:
    edges: List[PlaylistEdge]
    pageInfo: PageInfo
    totalCount: int

@strawberry_type
class Playlist:
    id: ID
    number: int
    theme: str
    date: date
    active: bool
    contest: bool
    winner_id: Optional[ID] = strawberry.field(name="winnerId")
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")
    songs: List[Song]
    winner: Optional[Song] = None

    @strawberry.field(name="songIds")
    def song_ids(self) -> List[ID]:
        """Get list of song IDs from the songs relationship."""
        return [str(song.id) for song in self.songs] if self.songs else []

    @classmethod
    async def get_playlists(
        cls,
        info: Info,
        first: int = 10,
        after: Optional[str] = None,
        filter: Optional[PlaylistFilter] = None
    ) -> PlaylistConnection:
        async with AsyncSessionLocal() as session:
            # Build base query with eager loading of relationships
            query = (
                select(PlaylistModel)
                .options(
                    selectinload(PlaylistModel.songs),
                    selectinload(PlaylistModel.winner)
                )
                .order_by(PlaylistModel.date.desc())
            )
            
            # Apply filters if provided
            if filter:
                if filter.theme:
                    query = query.filter(PlaylistModel.theme.ilike(f"%{filter.theme}%"))
                if filter.active is not None:
                    query = query.filter(PlaylistModel.active == filter.active)
                if filter.contest is not None:
                    query = query.filter(PlaylistModel.contest == filter.contest)

            # Get total count
            count_query = select(func.count()).select_from(query.subquery())
            total_count = await session.scalar(count_query)

            # Apply cursor pagination
            if after:
                cursor_date = decode_cursor(after)
                query = query.filter(PlaylistModel.date < cursor_date)

            # Fetch one extra to determine if there's a next page
            result = await session.execute(query.limit(first + 1))
            playlists = result.scalars().all()

            has_next_page = len(playlists) > first
            if has_next_page:
                playlists = playlists[:-1]

            edges = [
                PlaylistEdge(
                    node=cls.from_db(playlist),
                    cursor=encode_cursor(str(playlist.date))
                )
                for playlist in playlists
            ]

            return PlaylistConnection(
                edges=edges,
                pageInfo=PageInfo(
                    hasNextPage=has_next_page,
                    hasPreviousPage=after is not None,
                    startCursor=edges[0].cursor if edges else None,
                    endCursor=edges[-1].cursor if edges else None
                ),
                totalCount=total_count
            )

    @classmethod
    def from_db(cls, db_playlist: PlaylistModel) -> "Playlist":
        return cls(
            id=str(db_playlist.id),
            number=db_playlist.number,
            theme=db_playlist.theme,
            date=db_playlist.date,
            active=db_playlist.active,
            contest=db_playlist.contest,
            winner_id=str(db_playlist.winner_id) if db_playlist.winner_id else None,
            created_at=db_playlist.created_at,
            updated_at=db_playlist.updated_at,
            songs=[Song.from_db(song) for song in db_playlist.songs],
            winner=Song.from_db(db_playlist.winner) if db_playlist.winner else None
        )

@strawberry_type
class PlaylistInput:
    number: int
    theme: str
    date: date
    active: bool = True
    contest: bool = False
    winner_id: Optional[ID] = None

@strawberry_type
class PlaylistUpdateInput:
    number: Optional[int] = None
    theme: Optional[str] = None
    date: Optional[date] = None
    active: Optional[bool] = None
    contest: Optional[bool] = None
    winner_id: Optional[ID] = None 