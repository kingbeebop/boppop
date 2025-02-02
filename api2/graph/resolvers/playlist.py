from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from models.playlist import Playlist as PlaylistModel
from ..types import Playlist, PlaylistConnection, PlaylistFilter, PlaylistEdge, PageInfo
import strawberry
from strawberry.types import Info

async def get_playlist(id: strawberry.ID, info: Info) -> Optional[Playlist]:
    """Get a single playlist by ID."""
    session = await info.context.get_session()
    async with session.begin():
        stmt = (
            select(PlaylistModel)
            .options(selectinload(PlaylistModel.songs))
            .where(PlaylistModel.id == int(id))
        )
        result = await session.execute(stmt)
        playlist = result.scalar_one_or_none()
        if playlist:
            return Playlist.from_db(playlist)
        return None

async def get_current_challenge(info: Info) -> Optional[Playlist]:
    """Get the currently active playlist/challenge."""
    session = await info.context.get_session()
    async with session.begin():
        stmt = (
            select(PlaylistModel)
            .options(selectinload(PlaylistModel.songs))
            .where(PlaylistModel.active == True)
        )
        result = await session.execute(stmt)
        playlist = result.scalar_one_or_none()
        if playlist:
            return Playlist.from_db(playlist)
        return None

async def get_playlists(
    first: int = 10,
    after: Optional[str] = None,
    filter: Optional[PlaylistFilter] = None,
    info: Info = None
) -> PlaylistConnection:
    """Get a paginated list of playlists."""
    session = await info.context.get_session()
    async with session.begin():
        query = (
            select(PlaylistModel)
            .options(selectinload(PlaylistModel.songs))
        )

        if filter:
            if filter.active is not None:
                query = query.where(PlaylistModel.active == filter.active)
            if filter.contest is not None:
                query = query.where(PlaylistModel.contest == filter.contest)

        count_result = await session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total_count = count_result.scalar_one()

        if after:
            query = query.where(PlaylistModel.id > int(after))

        query = query.order_by(PlaylistModel.date.desc())
        query = query.limit(first)
        
        result = await session.execute(query)
        playlists = result.scalars().all()

        edges = [
            PlaylistEdge(
                node=Playlist.from_db(playlist),
                cursor=str(playlist.id)
            )
            for playlist in playlists
        ]

        return PlaylistConnection(
            edges=edges,
            pageInfo=PageInfo(
                hasNextPage=len(edges) == first and total_count > first,
                hasPreviousPage=bool(after),
                startCursor=edges[0].cursor if edges else None,
                endCursor=edges[-1].cursor if edges else None
            ),
            totalCount=total_count
        )