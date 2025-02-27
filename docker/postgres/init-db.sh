#!/bin/bash
set -e

# Function to clean database if DB_CLEAN is true
clean_database() {
    echo "Cleaning database..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO $POSTGRES_USER;
        GRANT ALL ON SCHEMA public TO public;
EOSQL
    echo "Database cleaned successfully"
}

# Check if DB_CLEAN is set to true
if [ "$DB_CLEAN" = "true" ]; then
    # Wait for database to be ready
    until pg_isready; do
        echo "Waiting for database to be ready..."
        sleep 2
    done
    
    clean_database
fi 