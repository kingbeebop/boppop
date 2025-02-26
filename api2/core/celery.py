from celery import Celery
from celery.schedules import crontab
from core.config import settings

# Initialize Celery app
celery_app = Celery(
    'boppop',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/New_York',
    enable_utc=True,
    broker_url=settings.REDIS_URL,
    result_backend=settings.REDIS_URL
)

# Configure periodic tasks
celery_app.conf.beat_schedule = {
    'start-contest': {
        'task': 'tasks.challenge_tasks.start_contest',
        # First Wednesday of every month at 6am ET
        'schedule': crontab(hour=6, minute=0, day_of_month='1-7', day_of_week='3'),
    },
    'end-contest': {
        'task': 'tasks.challenge_tasks.end_contest',
        # First Thursday of every month at 6am ET
        'schedule': crontab(hour=6, minute=0, day_of_month='1-7', day_of_week='4'),
    },
} 