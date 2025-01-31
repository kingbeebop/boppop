from typing import List
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "BopPop"
    VERSION: str = "0.1.0"
    
    # Database settings
    POSTGRES_SERVER: str = Field(default="db", alias="DB_HOST")
    POSTGRES_USER: str = Field(default="boppop_user", alias="DB_USER")
    POSTGRES_PASSWORD: str = Field(default="boppop_password", alias="DB_PASSWORD")
    POSTGRES_DB: str = Field(default="boppop", alias="DB_NAME")
    DB_ECHO: bool = False

    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        """Database URL for SQLAlchemy."""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    @property
    def ALEMBIC_DATABASE_URL(self) -> str:
        """Sync database URL for Alembic migrations."""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    # JWT settings
    JWT_SECRET: str = Field(default="your-super-secret-key")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 30
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # 15 minutes
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7     # 7 days

    # CORS settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost",
        "http://frontend:3000",
    ]

    # Redis settings
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        populate_by_name=True,
        extra="allow"
    )

settings = Settings()