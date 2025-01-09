from typing import AsyncGenerator
from sqlalchemy.orm import Session
from api2.db.session import get_db
from api2.graphql.inputs import ArtistInput
from api2.graphql.types import Artist
from api2.crud import crud
from broadcaster import Broadcast

broadcast = Broadcast("memory://")

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

    # Similar updates for other mutations