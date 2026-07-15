# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore
from pydantic import PostgresDsn

class Settings(BaseSettings):
    PROJECT_NAME: str = "RentStreet"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

settings = Settings()