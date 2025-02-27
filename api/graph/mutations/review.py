import strawberry
from typing import Optional
from db.session import get_db
from models.review import Review as ReviewModel
from sqlalchemy import select
from ..types.review import Review
from ..inputs.review import ReviewInput, ReviewUpdateInput

@strawberry.type
class ReviewMutations:
    @strawberry.mutation
    def create_review(self, input: ReviewInput) -> Review:
        db = next(get_db())
        review = ReviewModel(
            content=input.content,
            song_id=input.song_id,
            artist_id=input.artist_id
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        return review

    @strawberry.mutation
    def update_review(self, id: strawberry.ID, input: ReviewUpdateInput) -> Optional[Review]:
        db = next(get_db())
        review = db.execute(
            select(ReviewModel).where(ReviewModel.id == id)
        ).scalar_one_or_none()
        
        if not review:
            return None

        for field, value in input.__dict__.items():
            if value is not None:
                setattr(review, field, value)

        db.commit()
        db.refresh(review)
        return review

    @strawberry.mutation
    def delete_review(self, id: strawberry.ID) -> bool:
        db = next(get_db())
        review = db.execute(
            select(ReviewModel).where(ReviewModel.id == id)
        ).scalar_one_or_none()
        
        if not review:
            return False

        db.delete(review)
        db.commit()
        return True 