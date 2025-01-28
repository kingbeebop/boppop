from typing import Optional, List, Annotated
from datetime import datetime
from strawberry.types import Info
from strawberry import field
from strawberry import type as strawberry_type
from strawberry.scalars import ID
import strawberry
from sqlalchemy import select, or_, func
from db.session import AsyncSessionLocal
from models.artist import Artist as ArtistModel

@strawberry.enum
class SortDirection:
    ASC = "asc"
    DESC = "desc"

@strawberry.enum
class ArtistSortField:
    USERNAME = "username"
    NAME = "name"
    CREATED_AT = "created_at"

@strawberry.type
class PageInfo:
    total_items: int
    total_pages: int
    current_page: int
    has_next: bool
    has_prev: bool

@strawberry.type
class Artist:
    """Represents a user/artist in the system."""
    id: ID
    username: str
    name: Optional[str]
    email: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # from .song import Song
    # @field
    # async def songs(self, info: Info) -> List['Song']:
    #     """Get all songs created by this artist."""
    #     from models.song import Song as SongModel
    #     from sqlalchemy import select
    #     from db.session import get_db
        
    #     db = next(get_db())
    #     result = await db.execute(
    #         select(SongModel)
    #         .where(SongModel.artist_id == self.id)
    #         .order_by(SongModel.created_at.desc())
    #     )
    #     return result.scalars().all()

@strawberry_type
class ArtistInput:
    username: str
    email: str
    password: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None

@strawberry_type
class ArtistUpdateInput:
    username: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    profile_pic: Optional[str] = None

@strawberry_type
class ArtistConnection:
    items: List[Artist]
    page_info: PageInfo

@strawberry_type
class ArtistFilter:
    search: Optional[str] = strawberry.field(default=None)
    sort_by: Optional[ArtistSortField] = strawberry.field(default=ArtistSortField.NAME)
    sort_direction: Optional[SortDirection] = strawberry.field(default=SortDirection.ASC)

@strawberry.type
class Query:
    @strawberry.field
    async def artists(
        self,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        sort_by: Optional[ArtistSortField] = None,
        sort_direction: Optional[SortDirection] = None
    ) -> ArtistConnection:
        from sqlalchemy import select, or_
        from models.artist import Artist as ArtistModel
        from db.session import AsyncSessionLocal

        async with AsyncSessionLocal() as session:
            query = select(ArtistModel)

            # Apply search filter
            if search:
                query = query.where(
                    or_(
                        ArtistModel.username.ilike(f"%{search}%"),
                        ArtistModel.name.ilike(f"%{search}%")
                    )
                )

            # Apply sorting
            if sort_by:
                column = getattr(ArtistModel, sort_by.value)
                if sort_direction == SortDirection.DESC:
                    column = column.desc()
                query = query.order_by(column)

            # Count total items
            count_query = select(func.count()).select_from(query.subquery())
            total_items = await session.scalar(count_query)

            # Apply pagination
            total_pages = (total_items + limit - 1) // limit
            query = query.offset((page - 1) * limit).limit(limit)

            # Execute query
            result = await session.execute(query)
            artists = result.scalars().all()

            return ArtistConnection(
                items=[
                    Artist(
                        id=str(artist.id),
                        name=artist.name,
                        bio=artist.bio,
                        profile_pic=artist.profile_pic,
                        created_at=artist.created_at,
                        updated_at=artist.updated_at
                    ) for artist in artists
                ],
                page_info=PageInfo(
                    total_items=total_items,
                    total_pages=total_pages,
                    current_page=page,
                    has_next=page < total_pages,
                    has_prev=page > 1
                )
            )

    @strawberry.field
    async def artist(self, id: ID) -> Optional[Artist]:
        from sqlalchemy import select
        from models.artist import Artist as ArtistModel
        from db.session import AsyncSessionLocal

        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(ArtistModel).where(ArtistModel.id == int(id))
            )
            artist = result.scalar_one_or_none()
            
            if not artist:
                return None

            return Artist(
                id=str(artist.id),
                name=artist.name,
                bio=artist.bio,
                profile_pic=artist.profile_pic,
                created_at=artist.created_at,
                updated_at=artist.updated_at
            )