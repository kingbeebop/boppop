from sqlalchemy import event
from models import User, Artist
import logging
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

@event.listens_for(User, 'after_insert')
def create_artist_for_user(mapper, connection, user):
    """Create an artist for a new user if they don't have one already."""
    try:
        # Check if user already has an artist (shouldn't be possible for new users, but better safe)
        result = connection.execute(
            Artist.__table__.select().where(Artist.__table__.c.user_id == user.id)
        ).first()
        
        if not result:
            # Create artist with same name as username
            connection.execute(
                Artist.__table__.insert().values(
                    name=user.username,
                    user_id=user.id
                )
            )
            logger.info(f"Created artist profile for user {user.username}")
    except Exception as e:
        logger.error(f"Failed to create artist for user {user.username}: {str(e)}")
        raise