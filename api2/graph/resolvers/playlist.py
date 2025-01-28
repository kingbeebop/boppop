from typing import Optional
from sqlalchemy import select
from db.session import get_db
from models.playlist import Playlist as PlaylistModel
from ..types import Playlist, PaginatedResponse, PageInfo
import strawberry
from sqlalchemy import func
from db.session import AsyncSessionLocal
from ..types.playlist import PlaylistConnection, PlaylistEdge, PlaylistFilter
from ..utils import encode_cursor, decode_cursor, create_page_info

async def get_playlist(id: str) -> Optional[Playlist]:
    db = next(get_db())
    result = db.execute(
        select(PlaylistModel).where(PlaylistModel.id == id)
    ).scalar_one_or_none()
    return result

async def get_playlists(
    first: Optional[int] = 10,
    after: Optional[str] = None,
    filter: Optional[PlaylistFilter] = None
) -> PlaylistConnection:
    async with AsyncSessionLocal() as session:
        query = select(PlaylistModel).order_by(PlaylistModel.date.desc())

        if after:
            cursor_date = decode_cursor(after)
            query = query.where(PlaylistModel.date < cursor_date)

        if filter:
            if filter.theme:
                query = query.where(PlaylistModel.theme.ilike(f"%{filter.theme}%"))
            if filter.active is not None:
                query = query.where(PlaylistModel.active == filter.active)
            if filter.contest is not None:
                query = query.where(PlaylistModel.contest == filter.contest)

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_count = await session.scalar(count_query)

        # Get one extra item to determine if there are more items
        query = query.limit(first + 1)
        playlists = (await session.execute(query)).scalars().all()

        has_next_page = len(playlists) > first
        if has_next_page:
            playlists = playlists[:-1]

        edges = [
            PlaylistEdge(
                node=playlist,
                cursor=encode_cursor(playlist.date)
            )
            for playlist in playlists
        ]

        page_info = create_page_info(
            edges,
            has_next_page=has_next_page,
            has_previous_page=after is not None
        )

        return PlaylistConnection(
            edges=edges,
            pageInfo=page_info,
            totalCount=total_count
        )