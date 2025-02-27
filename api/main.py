from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.config import settings
from core.users import auth_backend, fastapi_users
from schemas.auth import UserRead, UserCreate, UserUpdate
from core.health import check_db_health
from core.events import *  # This will register our event listeners
from schemas.graphql import graphql_app
from db.session import engine
from strawberry.fastapi import GraphQLRouter
import os
from models.base import Base
from scripts.seed import seed_database
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

async def init_db():
    """Initialize database with tables and seed data."""
    try:
        db_clean = os.getenv('DB_CLEAN', 'false').lower() == 'true'
        logger.info(f"DB_CLEAN is set to: {db_clean}")

        if db_clean:
            logger.info("Dropping and recreating database schema...")
            async with engine.begin() as conn:
                await conn.execute(text("DROP SCHEMA public CASCADE"))
                await conn.execute(text("CREATE SCHEMA public"))
                await conn.execute(text(f"GRANT ALL ON SCHEMA public TO {settings.POSTGRES_USER}"))
                await conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
                await conn.commit()

            # Let alembic handle the migrations instead of SQLAlchemy
            from alembic.config import Config
            from alembic import command
            import asyncio

            def run_migrations():
                alembic_cfg = Config("alembic.ini")
                command.upgrade(alembic_cfg, "head")

            # Run migrations in a thread since alembic is synchronous
            await asyncio.get_event_loop().run_in_executor(None, run_migrations)
            logger.info("Database migrations completed")

            logger.info("Seeding database...")
            await seed_database()
            logger.info("Database initialization completed")

    except Exception as e:
        logger.error(f"Error during database initialization: {str(e)}")
        raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    db_healthy = await check_db_health()
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "database": "connected" if db_healthy else "disconnected"
    }

# Auth routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/auth/jwt",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/api/auth",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/api/auth",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/api/auth",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/api/users",
    tags=["users"]
)

# Mount GraphQL app - keep it simple
app.include_router(graphql_app, prefix="/api/graphql")