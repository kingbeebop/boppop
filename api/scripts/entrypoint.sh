#!/bin/bash
set -e

# Function for logging
log() {
    echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: $@"
}

# Wait for postgres
while ! nc -z $POSTGRES_SERVER $POSTGRES_PORT; do
    log "Waiting for postgres..."
    sleep 1
done

log "PostgreSQL started"

# Ensure database exists
log "Ensuring database exists..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_SERVER -U $POSTGRES_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1 || \
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_SERVER -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $POSTGRES_DB"

# Check current database state
export PYTHONPATH=/api
log "Checking database state..."

# Clean database if needed
if [ "$CLEAN_DB" = "true" ]; then
    log "Cleaning database..."
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_SERVER -U $POSTGRES_USER -d $POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
fi

# Run initial migration if needed
log "Running database migrations..."
alembic upgrade head

log "Seeding database..."
python << END
import asyncio
import logging
from scripts.seed import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    asyncio.run(seed_database())
except Exception as e:
    logger.error(f"Error seeding database: {str(e)}")
    raise
END

log "Database initialization completed"

# Start the FastAPI application
exec "$@"