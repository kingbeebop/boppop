import strawberry
from typing import Optional
from db.session import get_db
from models.playlist import Playlist as PlaylistModel
from sqlalchemy import select
from ..types.playlist import Playlist
from ..inputs.playlist import PlaylistInput, PlaylistUpdateInput

@strawberry.type
class PlaylistMutations:
    @strawberry.mutation
    def create_playlist(self, input: PlaylistInput) -> Playlist:
        db = next(get_db())
        playlist = PlaylistModel(
            number=input.number,
            theme=input.theme,
            date=input.date,
            active=input.active,
            contest=input.contest,
            winner_id=input.winner_id
        )
        db.add(playlist)
        db.commit()
        db.refresh(playlist)
        return playlist

    @strawberry.mutation
    def update_playlist(self, id: strawberry.ID, input: PlaylistUpdateInput) -> Optional[Playlist]:
        db = next(get_db())
        playlist = db.execute(
            select(PlaylistModel).where(PlaylistModel.id == id)
        ).scalar_one_or_none()
        
        if not playlist:
            return None

        for field, value in input.__dict__.items():
            if value is not None:
                setattr(playlist, field, value)

        db.commit()
        db.refresh(playlist)
        return playlist

    @strawberry.mutation
    def delete_playlist(self, id: strawberry.ID) -> bool:
        db = next(get_db())
        playlist = db.execute(
            select(PlaylistModel).where(PlaylistModel.id == id)
        ).scalar_one_or_none()
        
        if not playlist:
            return False

        db.delete(playlist)
        db.commit()
        return True 