from typing import AsyncGenerator
from sqlalchemy.orm import Session
from api2.db.session import get_db
from api2.graphql.inputs import ArtistInput
from api2.graphql.types import Artist
from api2.crud import crud
from redis.asyncio import Redis
from fastapi import Depends
from api2.core.redis import get_redis_client
import json

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_artist(
        self,
        input: ArtistInput,
        redis: Redis = Depends(get_redis_client)
    ) -> Artist:
        db = next(get_db())
        artist = crud.artist.create(db, obj_in=input)
        
        # Publish to Redis
        await redis.publish(
            "artist_updates",
            json.dumps({
                "artist": artist.dict(),
                "action": "created"
            })
        )
        
        return artist

    # Similar updates for other mutations