# app/core/config.py
# Pydantic settings for managing environment variables
from pydantic_settings import BaseSettings
import os

# construct absolute path to backend directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BACKEND_DIR / "synthetivolve.db"
DEFAULT_DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"

class Settings(BaseSettings):
    # Define settings variables here
    DATABASE_URL: str = DEFAULT_DATABASE_URL


    class Config:
        env_file = ".env"
    
settings = Settings()