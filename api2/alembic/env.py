from logging.config import fileConfig
import os
import sys
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Add parent directory to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from core.config import settings
from models import Base

config = context.config

# Use SQLite for local migration generation
if os.environ.get("USE_SQLITE", "true").lower() == "true":
    config.set_main_option("sqlalchemy.url", "sqlite:///:memory:")
else:
    # Use PostgreSQL in Docker
    config.set_main_option(
        "sqlalchemy.url",
        f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}"
        f"@{settings.POSTGRES_SERVER}/{settings.POSTGRES_DB}"
    )

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()