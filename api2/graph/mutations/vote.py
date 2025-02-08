import strawberry
from typing import Optional
from db.session import get_db, AsyncSessionLocal
from models.vote import Vote as VoteModel
from sqlalchemy import select, and_
from ..types.vote import Vote, BallotInput
from ..inputs.vote import VoteInput, VoteUpdateInput
from models.artist import Artist as ArtistModel
from models.playlist import Playlist as PlaylistModel
from models.song import Song as SongModel
from strawberry.types import Info
import logging
from sqlalchemy.orm import joinedload

logger = logging.getLogger(__name__)

@strawberry.type
class VoteMutations:
    @strawberry.mutation
    async def submit_ballot(
        self,
        input: "BallotInput",
        info: Info
    ) -> Vote:
        """Submit or update a vote for the current contest playlist."""
        user = await info.context.user
        auth_header = info.context.request.headers.get('Authorization')
        logger.info(f"Auth header in mutation: {auth_header}")
        
        if not user:
            logger.error("No authenticated user found")
            if not auth_header:
                raise ValueError("No authorization header found")
            raise ValueError("Invalid or expired authentication token")

        async with AsyncSessionLocal() as session:
            async with session.begin():  # Single transaction for the whole operation
                logger.info(f"Attempting vote with user: {user}")
                
                # Load artist with one query
                artist = await session.execute(
                    select(ArtistModel)
                    .where(ArtistModel.user_id == user.id)
                    .order_by(ArtistModel.created_at.desc())
                    .limit(1)
                )
                artist = artist.scalar_one_or_none()
                if not artist:
                    raise ValueError("No artist found for current user")

                # Find active contest playlist
                active_playlist = await session.execute(
                    select(PlaylistModel)
                    .where(and_(
                        PlaylistModel.active == True,
                        PlaylistModel.contest == True
                    ))
                )
                active_playlist = active_playlist.scalar_one_or_none()
                if not active_playlist:
                    raise ValueError("No Challenge Is Being Voted On Right Now, please try again later")

                # Verify song exists
                song = await session.execute(
                    select(SongModel)
                    .where(SongModel.id == int(input.song_id))
                )
                song = song.scalar_one_or_none()
                if not song:
                    raise ValueError("Song not found")

                # Look for existing vote with all relationships loaded
                existing_vote = await session.execute(
                    select(VoteModel)
                    .options(
                        joinedload(VoteModel.song).joinedload(SongModel.artist),
                        joinedload(VoteModel.artist),
                        joinedload(VoteModel.playlist)
                    )
                    .where(and_(
                        VoteModel.artist_id == artist.id,
                        VoteModel.playlist_id == active_playlist.id
                    ))
                )
                existing_vote = existing_vote.unique().scalar_one_or_none()

                if existing_vote:
                    # Update existing vote
                    existing_vote.song_id = int(input.song_id)
                    existing_vote.comments = input.comments
                    return Vote.from_db(existing_vote)
                
                # Create new vote
                new_vote = VoteModel(
                    song_id=int(input.song_id),
                    artist_id=artist.id,
                    playlist_id=active_playlist.id,
                    comments=input.comments
                )
                session.add(new_vote)
                await session.flush()  # Flush to get the new ID
                
                # Load the new vote with all relationships
                result = await session.execute(
                    select(VoteModel)
                    .options(
                        joinedload(VoteModel.song).joinedload(SongModel.artist),
                        joinedload(VoteModel.artist),
                        joinedload(VoteModel.playlist)
                    )
                    .where(VoteModel.id == new_vote.id)
                )
                loaded_vote = result.unique().scalar_one()
                return Vote.from_db(loaded_vote)

    # @strawberry.mutation
    # def create_vote(self, input: VoteInput) -> Vote:
    #     db = next(get_db())
    #     vote = VoteModel(
    #         song_id=input.song_id,
    #         artist_id=input.artist_id,
    #         playlist_id=input.playlist_id
    #     )
    #     db.add(vote)
    #     db.commit()
    #     db.refresh(vote)
    #     return vote

    # @strawberry.mutation
    # def update_vote(self, id: strawberry.ID, input: VoteUpdateInput) -> Optional[Vote]:
    #     db = next(get_db())
    #     vote = db.execute(
    #         select(VoteModel).where(VoteModel.id == id)
    #     ).scalar_one_or_none()
        
    #     if not vote:
    #         return None

    #     for field, value in input.__dict__.items():
    #         if value is not None:
    #             setattr(vote, field, value)

    #     db.commit()
    #     db.refresh(vote)
    #     return vote

    # @strawberry.mutation
    # def delete_vote(self, id: strawberry.ID) -> bool:
    #     db = next(get_db())
    #     vote = db.execute(
    #         select(VoteModel).where(VoteModel.id == id)
    #     ).scalar_one_or_none()
        
    #     if not vote:
    #         return False

    #     db.delete(vote)
    #     db.commit()
    #     return True 