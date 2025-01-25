#!/bin/bash
set -e

# Wait for postgres
while ! nc -z $POSTGRES_SERVER $POSTGRES_PORT; do
    echo "Waiting for postgres..."
    sleep 1
done

echo "PostgreSQL started"

# Run migrations with verbose output
echo "Running database migrations..."
export USE_SQLITE=false

# Clean up any existing alembic version
echo "Cleaning up alembic version..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_SERVER -U $POSTGRES_USER -d $POSTGRES_DB -c "DROP TABLE IF EXISTS alembic_version;"

# Run migrations
echo "Applying migrations..."
alembic upgrade head

echo "Migrations completed"

# Start the FastAPI application
exec "$@"