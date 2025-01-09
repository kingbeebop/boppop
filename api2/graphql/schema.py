import strawberry
from typing import List, Optional, AsyncGenerator
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime
import asyncio
from redis.asyncio import Redis
from graphql.types import Artist, Song, Playlist, Review, Vote, PaginatedResponse, PageInfo, ArtistSubscription, PlaylistSubscription, VoteSubscription
from graphql.inputs import ArtistInput, SongInput, PlaylistInput, ReviewInput, VoteInput, PaginationInput, SortInput, DateRangeInput, ArtistFilterInput, SongFilterInput, PlaylistFilterInput
from db.session import get_db
from core.redis import get_redis_client
import json

@strawberry.type
class Query:
    @strawberry.field
    def artist(self, id: int) -> Optional[Artist]:
        db = next(get_db())
        return crud.artist.get(db, id)

    @strawberry.field
    def artists(
        self, 
        pagination: Optional[PaginationInput] = None,
        filter: Optional[ArtistFilterInput] = None,
        sort: Optional[SortInput] = None
    ) -> PaginatedResponse[Artist]:
        db = next(get_db())
        query = db.query(models.Artist)

        # Apply filters
        if filter:
            if filter.search:
                query = query.filter(
                    or_(
                        models.Artist.username.ilike(f"%{filter.search}%"),
                        models.Artist.bio.ilike(f"%{filter.search}%")
                    )
                )
            if filter.is_active is not None:
                query = query.filter(models.Artist.is_active == filter.is_active)

        # Apply sorting
        if sort:
            order_by = getattr(models.Artist, sort.field)
            if sort.order == SortOrder.DESC:
                order_by = order_by.desc()
            query = query.order_by(order_by)

        # Apply pagination
        if pagination:
            page = pagination.page
            per_page = pagination.per_page
            total = query.count()
            items = query.offset((page - 1) * per_page).limit(per_page).all()

            return PaginatedResponse(
                items=items,
                page_info=PageInfo(
                    has_next_page=total > page * per_page,
                    has_previous_page=page > 1,
                    total_pages=(total + per_page - 1) // per_page,
                    total_items=total,
                    current_page=page
                )
            )

        return PaginatedResponse(
            items=query.all(),
            page_info=PageInfo(
                has_next_page=False,
                has_previous_page=False,
                total_pages=1,
                total_items=query.count(),
                current_page=1
            )
        )

    @strawberry.field
    def song(self, id: int) -> Optional[Song]:
        db = next(get_db())
        return crud.song.get(db, id)

    @strawberry.field
    def songs(self) -> List[Song]:
        db = next(get_db())
        return crud.song.get_multi(db)

    @strawberry.field
    def playlists(
        self,
        pagination: Optional[PaginationInput] = None,
        filter: Optional[PlaylistFilterInput] = None,
        sort: Optional[SortInput] = None
    ) -> PaginatedResponse[Playlist]:
        db = next(get_db())
        query = db.query(models.Playlist)

        # Apply filters
        if filter:
            if filter.search:
                query = query.filter(models.Playlist.theme.ilike(f"%{filter.search}%"))
            if filter.date_range:
                if filter.date_range.start_date:
                    query = query.filter(models.Playlist.date >= filter.date_range.start_date)
                if filter.date_range.end_date:
                    query = query.filter(models.Playlist.date <= filter.date_range.end_date)
            if filter.active is not None:
                query = query.filter(models.Playlist.active == filter.active)
            if filter.contest is not None:
                query = query.filter(models.Playlist.contest == filter.contest)

        # Similar pagination and sorting logic as artists query
        # ...

    # Similar queries for Review and Vote

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_artist(self, input: ArtistInput) -> Artist:
        db = next(get_db())
        artist = crud.artist.create(db, obj_in=input)
        
        # Broadcast the creation event
        await broadcast.publish(
            channel="artist_updates",
            message={
                "artist": artist,
                "action": "created"
            }
        )
        
        return artist

    @strawberry.mutation
    def update_artist(self, id: int, input: ArtistInput) -> Artist:
        db = next(get_db())
        artist = crud.artist.get(db, id)
        return crud.artist.update(db, db_obj=artist, obj_in=input)

    @strawberry.mutation
    def delete_artist(self, id: int) -> bool:
        db = next(get_db())
        crud.artist.remove(db, id)
        return True

    # Similar mutations for Song, Playlist, Review, and Vote

@strawberry.type
class Subscription:
    @strawberry.subscription
    async def artist_updates(self, redis: Redis = Depends(get_redis_client)) -> AsyncGenerator[ArtistSubscription, None]:
        pubsub = redis.pubsub()
        await pubsub.subscribe("artist_updates")
        
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True)
                if message is not None:
                    payload = json.loads(message["data"])
                    yield ArtistSubscription(
                        artist=payload["artist"],
                        action=payload["action"]
                    )
                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe("artist_updates")

    @strawberry.subscription
    async def playlist_updates(self, redis: Redis = Depends(get_redis_client)) -> AsyncGenerator[PlaylistSubscription, None]:
        pubsub = redis.pubsub()
        await pubsub.subscribe("playlist_updates")
        
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True)
                if message is not None:
                    payload = json.loads(message["data"])
                    yield PlaylistSubscription(
                        playlist=payload["playlist"],
                        action=payload["action"]
                    )
                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe("playlist_updates")

    @strawberry.subscription
    async def vote_updates(self) -> AsyncGenerator[VoteSubscription, None]:
        async with broadcast.subscribe(channel="vote_updates") as subscriber:
            async for event in subscriber:
                yield VoteSubscription(
                    vote=event.message["vote"],
                    action=event.message["action"]
                )

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription
)