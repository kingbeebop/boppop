from typing import List, Optional
from sqlalchemy import select, desc, asc, or_, func
from db.session import get_db
from models.song import Song as SongModel
from models.artist import Artist as ArtistModel
from ..types import (
    Song, 
    SongConnection, 
    SongFilter,
    SortDirection,
    PageInfo,
    SongEdge,
    ArtistRef
)
from strawberry.types import Info
from sqlalchemy.orm import joinedload, selectinload
from db.session import AsyncSessionLocal
import strawberry

@strawberry.field
async def song(self, id: str, info: Info) -> Optional[Song]:
    """Get a song by ID."""
    async with AsyncSessionLocal() as session:
        # Load song with artist in one query
        result = await session.execute(
            select(SongModel)
            .options(joinedload(SongModel.artist))  # Just load the artist
            .where(SongModel.id == int(id))
        )
        song_model = result.unique().scalar_one_or_none()
        
        if not song_model:
            return None

        return Song.from_db(song_model)

async def get_songs(
    first: int = 10,
    after: Optional[str] = None,
    filter: Optional[SongFilter] = None,
    info: Info = None
) -> SongConnection:
    """Get songs with pagination, filtering, and sorting."""
    session = await info.context.get_session()
    query = (
        select(SongModel, ArtistModel)
        .join(ArtistModel, SongModel.artist_id == ArtistModel.id)
    )

    if filter:
        if filter.search:
            search_term = f"%{filter.search}%"
            query = query.where(
                or_(
                    func.lower(SongModel.title).like(func.lower(search_term)),
                )
            )

        if filter.artist_id:
            query = query.where(SongModel.artist_id == int(filter.artist_id))

        sort_field = filter.sort_by or "created_at"
        sort_direction = filter.sort_direction or SortDirection.DESC

        order_column = getattr(SongModel, sort_field)
        if sort_direction == SortDirection.DESC:
            query = query.order_by(desc(order_column))
        else:
            query = query.order_by(asc(order_column))

    if after:
        cursor_id = int(after)
        cursor_song = await session.get(SongModel, cursor_id)
        if cursor_song:
            order_value = getattr(cursor_song, sort_field)
            order_column = getattr(SongModel, sort_field)
            
            if sort_direction == SortDirection.DESC:
                query = query.where(order_column < order_value)
            else:
                query = query.where(order_column > order_value)

    query = query.limit(first + 1)

    async with session.begin():
        result = await session.execute(query)
        rows = result.all()

    has_next_page = len(rows) > first
    rows = rows[:first]

    edges = [
        SongEdge(
            node=Song(
                id=str(song.id),
                title=song.title,
                url=song.url,
                artist=ArtistRef(
                    id=str(artist.id),
                    name=artist.name
                ),
                created_at=song.created_at,
                updated_at=song.updated_at
            ),
            cursor=str(song.id)
        ) for song, artist in rows
    ]

    return SongConnection(
        edges=edges,
        page_info=PageInfo(
            has_next_page=has_next_page,
            has_previous_page=bool(after),
            start_cursor=edges[0].cursor if edges else None,
            end_cursor=edges[-1].cursor if edges else None
        )
    )

async def get_songs_by_ids(ids: List[str], info: Info) -> List[Song]:
    """Get multiple songs by their IDs."""
    session = await info.context.get_session()
    async with session.begin():
        result = await session.execute(
            select(SongModel, ArtistModel)
            .join(ArtistModel, SongModel.artist_id == ArtistModel.id)
            .where(SongModel.id.in_([int(id) for id in ids]))
        )
        rows = result.all()
        return [
            Song(
                id=str(song.id),
                title=song.title,
                url=song.url,
                artist=ArtistRef(
                    id=str(artist.id),
                    name=artist.name
                ),
                created_at=song.created_at,
                updated_at=song.updated_at
            ) for song, artist in rows
        ]

@strawberry.field
async def get_songs(
    self,
    info: Info,
    first: int = 10,
    after: Optional[str] = None
) -> SongConnection:
    """Get paginated songs."""
    async with AsyncSessionLocal() as session:
        query = (
            select(SongModel)
            .options(joinedload(SongModel.artist))
            .order_by(SongModel.created_at.desc())
        )

        if after:
            query = query.where(SongModel.id < int(after))

        query = query.limit(first + 1)
        result = await session.execute(query)
        songs = result.unique().scalars().all()

        has_next_page = len(songs) > first
        if has_next_page:
            songs = songs[:-1]

        return SongConnection(
            edges=[
                SongEdge(
                    node=Song.from_db(song),
                    cursor=str(song.id)
                )
                for song in songs
            ],
            pageInfo=PageInfo(
                hasNextPage=has_next_page,
                endCursor=str(songs[-1].id) if songs else None
            )
        )