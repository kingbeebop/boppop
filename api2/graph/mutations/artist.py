import strawberry
from typing import Optional
from db.session import get_db
from models.artist import Artist as ArtistModel
from sqlalchemy import select
from ..types.artist import Artist
from ..inputs.artist import ArtistInput, ArtistUpdateInput

@strawberry.type
class ArtistMutations:
    @strawberry.mutation
    def create_artist(self, input: ArtistInput) -> Artist:
        db = next(get_db())
        artist = ArtistModel(
            username=input.username,
            email=input.email,
            bio=input.bio,
            profile_pic=input.profile_pic
        )
        db.add(artist)
        db.commit()
        db.refresh(artist)
        return artist

    @strawberry.mutation
    def update_artist(self, id: strawberry.ID, input: ArtistUpdateInput) -> Optional[Artist]:
        db = next(get_db())
        artist = db.execute(
            select(ArtistModel).where(ArtistModel.id == id)
        ).scalar_one_or_none()
        
        if not artist:
            return None

        for field, value in input.__dict__.items():
            if value is not None:
                setattr(artist, field, value)

        db.commit()
        db.refresh(artist)
        return artist

    @strawberry.mutation
    def delete_artist(self, id: strawberry.ID) -> bool:
        db = next(get_db())
        artist = db.execute(
            select(ArtistModel).where(ArtistModel.id == id)
        ).scalar_one_or_none()
        
        if not artist:
            return False

        db.delete(artist)
        db.commit()
        return True