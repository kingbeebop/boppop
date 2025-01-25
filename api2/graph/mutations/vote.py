import strawberry
from typing import Optional
from db.session import get_db
from models.vote import Vote as VoteModel
from sqlalchemy import select
from ..types.vote import Vote
from ..inputs.vote import VoteInput, VoteUpdateInput

@strawberry.type
class VoteMutations:
    @strawberry.mutation
    def create_vote(self, input: VoteInput) -> Vote:
        db = next(get_db())
        vote = VoteModel(
            song_id=input.song_id,
            artist_id=input.artist_id,
            playlist_id=input.playlist_id
        )
        db.add(vote)
        db.commit()
        db.refresh(vote)
        return vote

    @strawberry.mutation
    def update_vote(self, id: strawberry.ID, input: VoteUpdateInput) -> Optional[Vote]:
        db = next(get_db())
        vote = db.execute(
            select(VoteModel).where(VoteModel.id == id)
        ).scalar_one_or_none()
        
        if not vote:
            return None

        for field, value in input.__dict__.items():
            if value is not None:
                setattr(vote, field, value)

        db.commit()
        db.refresh(vote)
        return vote

    @strawberry.mutation
    def delete_vote(self, id: strawberry.ID) -> bool:
        db = next(get_db())
        vote = db.execute(
            select(VoteModel).where(VoteModel.id == id)
        ).scalar_one_or_none()
        
        if not vote:
            return False

        db.delete(vote)
        db.commit()
        return True 