# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore
from pydantic import PostgresDsn

class Settings(BaseSettings):
    PROJECT_NAME: str = "RentStreet"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

settings = Settings()