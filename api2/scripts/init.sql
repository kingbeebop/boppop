-- Create database if not exists
SELECT 'CREATE DATABASE boppop'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'boppop')\gexec

-- Connect to the new database
\c boppop

-- Create user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'boppop_user') THEN
    CREATE USER boppop_user WITH PASSWORD 'boppop_password';
    GRANT ALL PRIVILEGES ON DATABASE boppop TO boppop_user;
  END IF;
END
$$;