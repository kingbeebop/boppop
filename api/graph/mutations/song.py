import strawberry
from typing import Optional
from sqlalchemy import select, and_
from db.session import AsyncSessionLocal
from models.song import Song as SongModel
from models.artist import Artist as ArtistModel
from models.playlist import Playlist as PlaylistModel
from models.playlist_songs import playlist_songs
from ..types.song import Song
from ..inputs.song import SongSubmissionInput, SongInput, SongUpdateInput
from strawberry.types import Info

@strawberry.type
class SongMutations:
    @strawberry.mutation
    async def submit_or_update_song(
        self,
        input: "SongSubmissionInput",
        info: Info
    ) -> Song:
        """Submit or update a song for the current active playlist."""
        async with AsyncSessionLocal() as session:
            # Verify user is authenticated and has an artist profile
            if not info.context.user:
                raise ValueError("Not authenticated")

            artist = await session.execute(
                select(ArtistModel)
                .where(ArtistModel.user_id == info.context.user.id)
            )
            artist = artist.scalar_one_or_none()
            if not artist:
                raise ValueError("No artist found for current user")

            # Find active non-contest playlist
            active_playlist = await session.execute(
                select(PlaylistModel)
                .where(and_(
                    PlaylistModel.active == True,
                    PlaylistModel.contest == False
                ))
            )
            active_playlist = active_playlist.scalar_one_or_none()
            if not active_playlist:
                raise ValueError("No playlist currently accepting submissions")

            # Look for existing submission in this playlist
            existing_song = await session.execute(
                select(SongModel)
                .join(playlist_songs)
                .where(and_(
                    SongModel.artist_id == artist.id,
                    playlist_songs.c.playlist_id == active_playlist.id
                ))
            )
            existing_song = existing_song.scalar_one_or_none()

            if existing_song:
                # Update existing submission
                existing_song.title = input.title
                existing_song.url = input.url
                await session.commit()
                return Song.from_db(existing_song)
            
            # Create new submission
            new_song = SongModel(
                title=input.title,
                url=input.url,
                artist_id=artist.id
            )
            session.add(new_song)
            await session.flush()  # Get the ID before adding to playlist

            # Add to playlist
            await session.execute(
                playlist_songs.insert().values(
                    playlist_id=active_playlist.id,
                    song_id=new_song.id
                )
            )
            await session.commit()
            
            return Song.from_db(new_song)

    @strawberry.mutation
    async def create_song(self, input: SongInput) -> Song:
        async with AsyncSessionLocal() as session:
            song = SongModel(
                title=input.title,
                url=input.url,
                artist_id=input.artist_id,
                playlist_id=input.playlist_id
            )
            session.add(song)
            await session.commit()
            await session.refresh(song)
            return Song.from_db(song)

    @strawberry.mutation
    async def update_song(self, id: strawberry.ID, input: SongUpdateInput) -> Optional[Song]:
        async with AsyncSessionLocal() as session:
            song = await session.execute(
                select(SongModel).where(SongModel.id == id)
            )
            song = song.scalar_one_or_none()
            
            if not song:
                return None

            for field, value in input.__dict__.items():
                if value is not None:
                    setattr(song, field, value)

            await session.commit()
            await session.refresh(song)
            return Song.from_db(song)

    @strawberry.mutation
    async def delete_song(self, id: strawberry.ID) -> bool:
        async with AsyncSessionLocal() as session:
            song = await session.execute(
                select(SongModel).where(SongModel.id == id)
            )
            song = song.scalar_one_or_none()
            
            if not song:
                return False

            await session.delete(song)
            await session.commit()
            return True