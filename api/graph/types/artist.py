import strawberry
from typing import Optional, List
from datetime import datetime
from enum import Enum
from strawberry.types import Info
from strawberry import field
from strawberry import type as strawberry_type
from strawberry.scalars import ID
from sqlalchemy import select, or_, func
from db.session import AsyncSessionLocal
from models.artist import Artist as ArtistModel
from .pagination import Connection, Edge, PageInfo

@strawberry.enum
class SortDirection(Enum):
    ASC = "ASC"
    DESC = "DESC"

@strawberry.enum
class ArtistSortField(Enum):
    NAME = "NAME"
    CREATED_AT = "CREATED_AT"

@strawberry.type
class Artist:
    """Represents an artist profile."""
    id: ID
    name: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = strawberry.field(name="profilePic")
    user_id: ID = strawberry.field(name="userId")
    song_ids: List[ID] = strawberry.field(name="songIds")
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")

    @classmethod
    def from_db(cls, db_artist: ArtistModel) -> "Artist":
        """Convert database model to GraphQL type."""
        return cls(
            id=ID(str(db_artist.id)),
            name=db_artist.name,
            bio=db_artist.bio,
            profile_pic=db_artist.profile_pic,
            user_id=ID(str(db_artist.user_id)),
            song_ids=[ID(str(song.id)) for song in db_artist.songs],
            created_at=db_artist.created_at,
            updated_at=db_artist.updated_at
        )

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
    """Input type for creating an artist."""
    name: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None

@strawberry_type
class ArtistUpdateInput:
    """Input type for updating an artist."""
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_pic: Optional[str] = None

# Use the generic types
ArtistEdge = Edge[Artist]
ArtistConnection = Connection[Artist]

@strawberry.input
class ArtistFilter:
    search: Optional[str] = None
    sort_by: Optional[ArtistSortField] = None
    sort_direction: Optional[SortDirection] = None

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
        async with AsyncSessionLocal() as session:
            query = select(ArtistModel)

            # Apply search filter
            if search:
                query = query.where(ArtistModel.name.ilike(f"%{search}%"))

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
                    Artist.from_db(artist) for artist in artists
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

            return Artist.from_db(artist)

@strawberry.type
class ArtistEdge:
    """An edge in the artist connection."""
    node: Artist
    cursor: str

@strawberry.type
class ArtistConnection:
    """A connection of artists."""
    edges: List[ArtistEdge]
    pageInfo: PageInfo
    totalCount: int

@strawberry.type
class PageInfo:
    """Information about pagination."""
    hasNextPage: bool
    hasPreviousPage: bool
    startCursor: Optional[str]
    endCursor: Optional[str]

@strawberry.type
class ArtistRef:
    """A simplified artist reference."""
    id: ID
    name: str

    @classmethod
    def from_db(cls, artist_model):
        if not artist_model:
            return None
        return cls(
            id=ID(str(artist_model.id)),
            name=artist_model.name
        )