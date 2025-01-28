from sqlalchemy import event
from models import User, Artist
from sqlalchemy.ext.asyncio import AsyncSession

@event.listens_for(User, 'after_insert')
def create_artist_for_user(mapper, connection, user):
    # Create artist with same name as username
    artist = Artist(
        name=user.username,
        user_id=user.id
    )
    
    # We need to use the sync API here because this is a sync event
    connection.execute(
        Artist.__table__.insert().values(
            name=user.username,
            user_id=user.id
        )
    )