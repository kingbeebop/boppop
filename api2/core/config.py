from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bop Pop"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    POSTGRES_SERVER: str = Field(default="db", alias="DB_HOST")
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = Field(default="boppop_user", alias="DB_USER")
    POSTGRES_PASSWORD: str = Field(default="boppop_password", alias="DB_PASSWORD")
    POSTGRES_DB: str = Field(default="boppop", alias="DB_NAME")
    
    API_HOST: str = Field(default="0.0.0.0")
    API_PORT: int = Field(default=8000)
    
    JWT_SECRET: str = Field(default="your-super-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    NEXT_PUBLIC_API_BASE_URL: str = Field(default="http://localhost:8080")
    NEXT_PUBLIC_API_URL: str = Field(default="http://localhost:8080/api")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
    ]
    
    class Config:
        env_file = Path(__file__).parents[2] / '.env'
        case_sensitive = True
        extra = "allow"
        populate_by_name = True

settings = Settings()