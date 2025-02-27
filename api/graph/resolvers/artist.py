from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from models.artist import Artist as ArtistModel
from ..types import (
    Artist, 
    ArtistConnection, 
    ArtistFilter,
    SortDirection,
    PageInfo,
    ArtistEdge
)
import strawberry
from strawberry.types import Info

async def get_artist(id: strawberry.ID, info: Info) -> Optional[Artist]:
    """Get a single artist by ID."""
    session = await info.context.get_session()
    async with session.begin():
        # Use selectinload to eagerly load relationships
        stmt = (
            select(ArtistModel)
            .options(selectinload(ArtistModel.user))
            .options(selectinload(ArtistModel.songs))
            .where(ArtistModel.id == int(id))
        )
        result = await session.execute(stmt)
        artist = result.scalar_one_or_none()
        if artist:
            # Convert to GraphQL type within the async context
            return Artist.from_db(artist)
        return None

async def get_artists(
    first: int = 10,
    after: Optional[str] = None,
    filter: Optional[ArtistFilter] = None,
    info: Info = None
) -> ArtistConnection:
    """Get a paginated list of artists."""
    session = await info.context.get_session()
    async with session.begin():
        # Use selectinload to eagerly load relationships
        query = (
            select(ArtistModel)
            .options(selectinload(ArtistModel.user))
            .options(selectinload(ArtistModel.songs))
        )

        if filter and filter.search:
            query = query.where(ArtistModel.name.ilike(f"%{filter.search}%"))

        count_result = await session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total_count = count_result.scalar_one()

        if after:
            query = query.where(ArtistModel.id > int(after))

        if filter and filter.sort_by:
            column = getattr(ArtistModel, filter.sort_by.value.lower())
            if filter.sort_direction == SortDirection.DESC:
                column = column.desc()
            query = query.order_by(column)
        else:
            query = query.order_by(ArtistModel.id)

        query = query.limit(first)
        result = await session.execute(query)
        artists = result.scalars().all()

        edges = [
            ArtistEdge(
                node=Artist.from_db(artist),
                cursor=str(artist.id)
            )
            for artist in artists
        ]

        return ArtistConnection(
            edges=edges,
            pageInfo=PageInfo(
                hasNextPage=len(edges) == first and total_count > first,
                hasPreviousPage=bool(after),
                startCursor=edges[0].cursor if edges else None,
                endCursor=edges[-1].cursor if edges else None
            ),
            totalCount=total_count
        )