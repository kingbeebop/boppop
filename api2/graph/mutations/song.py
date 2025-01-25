import strawberry
from typing import Optional
from db.session import get_db
from models.song import Song as SongModel
from sqlalchemy import select
from ..types.song import Song
from ..inputs.song import SongInput, SongUpdateInput

@strawberry.type
class SongMutations:
    @strawberry.mutation
    def create_song(self, input: SongInput) -> Song:
        db = next(get_db())
        song = SongModel(
            title=input.title,
            url=input.url,
            artist_id=input.artist_id,
            playlist_id=input.playlist_id
        )
        db.add(song)
        db.commit()
        db.refresh(song)
        return song

    @strawberry.mutation
    def update_song(self, id: strawberry.ID, input: SongUpdateInput) -> Optional[Song]:
        db = next(get_db())
        song = db.execute(
            select(SongModel).where(SongModel.id == id)
        ).scalar_one_or_none()
        
        if not song:
            return None

        for field, value in input.__dict__.items():
            if value is not None:
                setattr(song, field, value)

        db.commit()
        db.refresh(song)
        return song

    @strawberry.mutation
    def delete_song(self, id: strawberry.ID) -> bool:
        db = next(get_db())
        song = db.execute(
            select(SongModel).where(SongModel.id == id)
        ).scalar_one_or_none()
        
        if not song:
            return False

        db.delete(song)
        db.commit()
        return True