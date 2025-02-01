import strawberry
from typing import List, Optional
from datetime import datetime, date
from enum import Enum
from sqlalchemy import select, or_, func, and_
from sqlalchemy.orm import selectinload
from db.session import AsyncSessionLocal
from models import User, Artist as ArtistModel, Song, Review, Vote, Playlist as PlaylistModel
from .utils import encode_cursor, decode_cursor
from graph.types.playlist import (
    Playlist,
    PlaylistConnection,
    PlaylistFilter,
    PlaylistEdge,
    PageInfo
)
from graph.types.artist import Artist  # Import Artist from graph.types.artist
from graph.schema import schema
from graph.inputs.song import SongSubmissionInput
from graph.mutations.song import SongMutations
from fastapi import Request
from graph.context import get_graphql_context

@strawberry.type
class UserType:
    id: int
    email: str
    username: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

@strawberry.type
class ArtistBasicType:
    id: strawberry.ID
    name: str

@strawberry.type
class SongBasicType:
    id: strawberry.ID
    title: str
    url: str
    artistId: strawberry.ID
    artistName: str

@strawberry.type
class ArtistType:
    id: int
    name: str
    bio: Optional[str]
    profile_pic: Optional[str]
    user: UserType
    created_at: datetime
    updated_at: datetime

@strawberry.type
class SongType:
    id: int
    title: str
    url: str
    artist: ArtistBasicType  # Use basic type to avoid recursion
    created_at: datetime
    updated_at: datetime

@strawberry.type
class PlaylistBasicType:
    id: int
    number: int
    theme: str
    date: date
    active: bool
    contest: bool

@strawberry.type
class ReviewBasicType:
    id: int
    content: str
    song_id: int
    author_id: int
    playlist_id: int

@strawberry.type
class VoteBasicType:
    id: int
    song_id: int
    artist_id: int
    playlist_id: int
    comments: Optional[str]

@strawberry.type
class PlaylistType:
    id: strawberry.ID
    number: int
    theme: str
    date: date
    active: bool
    contest: bool
    winnerId: Optional[strawberry.ID]
    songIds: List[strawberry.ID]
    createdAt: datetime
    updatedAt: datetime

    @classmethod
    def from_db_model(cls, playlist: "Playlist") -> "PlaylistType":
        if not playlist:
            return None
        return cls(
            id=playlist.id,
            number=playlist.number,
            theme=playlist.theme,
            date=playlist.date,
            active=playlist.active,
            contest=playlist.contest,
            winnerId=str(playlist.winner_id) if playlist.winner_id else None,
            songIds=[str(song.id) for song in playlist.songs],
            createdAt=playlist.created_at,
            updatedAt=playlist.updated_at
        )

@strawberry.type
class ReviewType:
    id: int
    content: str
    song: SongBasicType
    author: ArtistBasicType
    playlist: PlaylistBasicType
    created_at: datetime
    updated_at: datetime

@strawberry.type
class VoteType:
    id: int
    song: SongBasicType
    artist: ArtistBasicType
    playlist: PlaylistBasicType
    comments: Optional[str]
    created_at: datetime
    updated_at: datetime

@strawberry.enum
class SortDirection(Enum):
    ASC = "asc"
    DESC = "desc"

@strawberry.enum
class ArtistSortField(Enum):
    NAME = "name"
    CREATED_AT = "createdAt"

@strawberry.enum
class PlaylistSortField(Enum):
    THEME = "theme"
    DATE = "date"
    NUMBER = "number"

@strawberry.type
class ArtistEdge:
    node: Artist
    cursor: str

@strawberry.type
class ArtistConnection:
    edges: List[ArtistEdge]
    pageInfo: PageInfo
    totalCount: int

@strawberry.input
class ArtistFilter:
    search: Optional[str] = strawberry.field(default=None)
    sortBy: Optional[ArtistSortField] = strawberry.field(default=ArtistSortField.NAME)
    sortDirection: Optional[SortDirection] = strawberry.field(default=SortDirection.ASC)

@strawberry.type
class Query:
    @strawberry.field
    async def artists(
        self,
        first: Optional[int] = 10,
        after: Optional[str] = None,
        filter: Optional[ArtistFilter] = None
    ) -> ArtistConnection:
        async with AsyncSessionLocal() as session:
            query = select(ArtistModel).options(selectinload(ArtistModel.songs))

            if filter and filter.search:
                search_terms = filter.search.split()
                search_conditions = []
                for term in search_terms:
                    search_conditions.append(
                        ArtistModel.name.ilike(f"%{term}%")
                    )
                if search_conditions:
                    query = query.where(and_(*search_conditions))

            if filter and filter.sortBy:
                column = getattr(ArtistModel, filter.sortBy.value)
                if filter.sortDirection == SortDirection.DESC:
                    column = column.desc()
                query = query.order_by(column)

            count_query = select(func.count()).select_from(query.subquery())
            total_count = await session.scalar(count_query)

            if after:
                cursor_value = decode_cursor(after)
                query = query.where(ArtistModel.id > int(cursor_value))

            query = query.limit(first + 1)
            result = await session.execute(query)
            artists = result.scalars().all()

            has_next_page = len(artists) > first
            artists = artists[:first]

            edges = [
                ArtistEdge(
                    node=Artist.from_db(artist),
                    cursor=encode_cursor(str(artist.id))
                ) for artist in artists
            ]

            return ArtistConnection(
                edges=edges,
                pageInfo=PageInfo(
                    hasNextPage=has_next_page,
                    hasPreviousPage=after is not None,
                    startCursor=edges[0].cursor if edges else None,
                    endCursor=edges[-1].cursor if edges else None
                ),
                totalCount=total_count
            )

    @strawberry.field
    async def playlists(
        self,
        info: strawberry.types.Info,
        first: Optional[int] = 10,
        after: Optional[str] = None,
        filter: Optional[PlaylistFilter] = None
    ) -> PlaylistConnection:
        async with info.context.session.begin():
            query = (
                select(PlaylistModel)
                .options(
                    selectinload(PlaylistModel.songs).selectinload(Song.artist),
                    selectinload(PlaylistModel.winner)
                )
                .order_by(PlaylistModel.date.desc())
            )

            if filter:
                conditions = []
                if filter.search:
                    conditions.append(PlaylistModel.theme.ilike(f"%{filter.search}%"))
                if filter.active is not None:
                    conditions.append(PlaylistModel.active == filter.active)
                if filter.contest is not None:
                    conditions.append(PlaylistModel.contest == filter.contest)
                if conditions:
                    query = query.where(or_(*conditions))

            # Apply cursor-based pagination
            if after:
                cursor_date = decode_cursor(after)
                query = query.where(PlaylistModel.date < cursor_date)

            # Get total count
            count_result = await info.context.session.execute(
                select(func.count()).select_from(query.subquery())
            )
            total_count = count_result.scalar_one()

            # Get playlists
            result = await info.context.session.execute(
                query.limit(first + 1)
            )
            playlists = result.unique().scalars().all()

            # Handle pagination
            has_next_page = len(playlists) > first
            if has_next_page:
                playlists = playlists[:-1]

            edges = [
                PlaylistEdge(
                    node=Playlist.from_db(playlist),
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

    @strawberry.field
    async def song(self, id: strawberry.ID) -> Optional[SongBasicType]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(Song)
                .options(selectinload(Song.artist))
                .where(Song.id == int(id))
            )
            song = result.scalar_one_or_none()
            if not song:
                return None
            return SongBasicType(
                id=str(song.id),
                title=song.title,
                url=song.url,
                artistId=str(song.artist_id),
                artistName=song.artist.name
            )

    @strawberry.field
    async def songs_by_ids(self, ids: List[strawberry.ID]) -> List[SongBasicType]:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(Song)
                .options(selectinload(Song.artist))
                .where(Song.id.in_([int(id) for id in ids]))
            )
            songs = result.scalars().all()
            return [
                SongBasicType(
                    id=str(song.id),
                    title=song.title,
                    url=song.url,
                    artistId=str(song.artist_id),
                    artistName=song.artist.name
                ) for song in songs
            ]

    @strawberry.field
    async def current_challenge(self) -> Optional[PlaylistType]:
        """Get the most recent playlist as the current challenge."""
        async with AsyncSessionLocal() as session:
            # Get the playlist with the highest number (most recent)
            query = (
                select(PlaylistModel)
                .options(selectinload(PlaylistModel.songs))
                .order_by(PlaylistModel.number.desc())
                .limit(1)
            )
            
            result = await session.execute(query)
            playlist = result.scalar_one_or_none()
            
            if not playlist:
                return None
                
            return PlaylistType.from_db_model(playlist)

    @strawberry.field
    async def last_challenge(self) -> Optional[PlaylistType]:
        """Get the previous playlist (second most recent)."""
        async with AsyncSessionLocal() as session:
            query = (
                select(PlaylistModel)
                .options(selectinload(PlaylistModel.songs))
                .order_by(PlaylistModel.number.desc())
                .offset(1)  # Skip the current challenge
                .limit(1)
            )
            
            result = await session.execute(query)
            playlist = result.scalar_one_or_none()
            
            if not playlist:
                return None
                
            return PlaylistType.from_db_model(playlist)

    @strawberry.field
    async def current_submission(self, info: strawberry.types.Info) -> Optional[SongBasicType]:
        """Get the current user's submission for the active playlist if it exists."""
        context = info.context
        if not context.user:
            return None

        # First get the current playlist (most recent by number)
        playlist_result = await context.session.execute(
            select(PlaylistModel)
            .order_by(PlaylistModel.number.desc())
            .limit(1)
        )
        current_playlist = playlist_result.scalar_one_or_none()
        
        if not current_playlist:
            return None

        # Then find if the user's artist has a song in this playlist
        song_result = await context.session.execute(
            select(Song)
            .join(Song.artist)
            .join(Song.playlists)
            .options(selectinload(Song.artist))
            .where(
                and_(
                    PlaylistModel.id == current_playlist.id,
                    Song.artist_id == context.artist.id if context.artist else None
                )
            )
        )
        
        song = song_result.scalar_one_or_none()
        
        if not song:
            return None

        return SongBasicType.from_db_model(song)

# Conversion methods
@classmethod
def artist_basic_from_db(cls, db_artist: ArtistModel) -> "ArtistBasicType":
    return cls(
        id=db_artist.id,
        name=db_artist.name
    )

@classmethod
def song_basic_from_db(cls, db_song: Song) -> "SongBasicType":
    return cls(
        id=db_song.id,
        title=db_song.title,
        url=db_song.url,
        artistId=db_song.artist_id,
        artistName=db_song.artist.name
    )

@classmethod
def artist_from_db(cls, db_artist: ArtistModel) -> "Artist":
    return cls(
        id=str(db_artist.id),
        name=db_artist.name,
        bio=db_artist.bio,
        profilePic=db_artist.profile_pic,
        songIds=[str(song.id) for song in db_artist.songs],
        createdAt=db_artist.created_at,
        updatedAt=db_artist.updated_at
    )

@classmethod
def song_from_db(cls, db_song: Song) -> "SongType":
    return cls(
        id=db_song.id,
        title=db_song.title,
        url=db_song.url,
        artist=ArtistBasicType.from_db_model(db_song.artist),
        created_at=db_song.created_at,
        updated_at=db_song.updated_at,
    )

@classmethod
def user_from_db(cls, db_user: User) -> "UserType":
    return cls(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        is_active=db_user.is_active,
        is_verified=db_user.is_verified,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
    )

@classmethod
def playlist_from_db(cls, db_playlist: PlaylistModel) -> "PlaylistType":
    return cls(
        id=str(db_playlist.id),
        number=db_playlist.number,
        theme=db_playlist.theme,
        date=db_playlist.date,
        active=db_playlist.active,
        contest=db_playlist.contest,
        winnerId=str(db_playlist.winner_id) if db_playlist.winner_id else None,
        songIds=[str(song.id) for song in db_playlist.songs],
        createdAt=db_playlist.created_at,
        updatedAt=db_playlist.updated_at
    )

@classmethod
def review_from_db(cls, db_review: Review) -> "ReviewType":
    return cls(
        id=db_review.id,
        content=db_review.content,
        song=SongBasicType.from_db_model(db_review.song),
        author=ArtistBasicType.from_db_model(db_review.author),
        playlist=PlaylistBasicType.from_db_model(db_review.playlist),
        created_at=db_review.created_at,
        updated_at=db_review.updated_at,
    )

@classmethod
def vote_from_db(cls, db_vote: Vote) -> "VoteType":
    return cls(
        id=db_vote.id,
        song=SongBasicType.from_db_model(db_vote.song),
        artist=ArtistBasicType.from_db_model(db_vote.artist),
        playlist=PlaylistBasicType.from_db_model(db_vote.playlist),
        comments=db_vote.comments,
        created_at=db_vote.created_at,
        updated_at=db_vote.updated_at,
    )

@classmethod
def playlist_basic_from_db(cls, db_playlist: PlaylistModel) -> "PlaylistBasicType":
    return cls(
        id=db_playlist.id,
        number=db_playlist.number,
        theme=db_playlist.theme,
        date=db_playlist.date,
        active=db_playlist.active,
        contest=db_playlist.contest
    )

@classmethod
def review_basic_from_db(cls, db_review: Review) -> "ReviewBasicType":
    return cls(
        id=db_review.id,
        content=db_review.content,
        song_id=db_review.song_id,
        author_id=db_review.author_id,
        playlist_id=db_review.playlist_id
    )

@classmethod
def vote_basic_from_db(cls, db_vote: Vote) -> "VoteBasicType":
    return cls(
        id=db_vote.id,
        song_id=db_vote.song_id,
        artist_id=db_vote.artist_id,
        playlist_id=db_vote.playlist_id,
        comments=db_vote.comments
    )

# Assign conversion methods
UserType.from_db_model = user_from_db
ArtistBasicType.from_db_model = artist_basic_from_db
SongBasicType.from_db_model = song_basic_from_db
ArtistType.from_db_model = artist_from_db
SongType.from_db_model = song_from_db
PlaylistType.from_db_model = playlist_from_db
ReviewType.from_db_model = review_from_db
VoteType.from_db_model = vote_from_db
PlaylistBasicType.from_db_model = playlist_basic_from_db
ReviewBasicType.from_db_model = review_basic_from_db
VoteBasicType.from_db_model = vote_basic_from_db

# Make sure the schema is properly configured with all types

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def submit_or_update_song(
        self,
        input: SongSubmissionInput,
        info: strawberry.types.Info
    ) -> SongBasicType:
        context = info.context
        
        if not context.is_authenticated:
            raise ValueError("Not authenticated")

        if not context.artist:
            raise ValueError("No artist profile found")

        # Find active non-contest playlist
        active_playlist = await context.session.execute(
            select(PlaylistModel)
            .where(and_(
                PlaylistModel.active == True,
                PlaylistModel.contest == False
            ))
        )
        active_playlist = active_playlist.scalar_one_or_none()
        if not active_playlist:
            raise ValueError("No playlist currently accepting submissions")

        # Look for existing submission
        existing_song = await context.session.execute(
            select(Song)
            .join(Song.playlists)
            .options(selectinload(Song.artist))
            .where(and_(
                PlaylistModel.id == active_playlist.id,
                Song.artist_id == context.artist.id
            ))
        )
        existing_song = existing_song.scalar_one_or_none()

        if existing_song:
            # Update existing submission
            existing_song.title = input.title
            existing_song.url = input.url
            await context.session.commit()
            return SongBasicType.from_db_model(existing_song)
        
        # Create new submission
        new_song = Song(
            title=input.title,
            url=input.url,
            artist_id=context.artist.id
        )
        new_song.playlists.append(active_playlist)
        context.session.add(new_song)
        await context.session.commit()
        await context.session.refresh(new_song)
        
        return SongBasicType.from_db_model(new_song)

# Update the schema to include mutations
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    types=[SongSubmissionInput],
    extensions=[
        # Add any extensions you need
    ]
)

# Create an async context manager for the schema
async def get_context(request: Request):
    return await get_graphql_context(request)