# backend/app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# 1. Create the database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True, # Automatically checks and fixes dropped connections
)

# 2. Create a session factory 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Base class that our SQLAlchemy models will inherit from
Base = declarative_base()

# 4. Dependency function to inject database sessions into our API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() # Ensures connection is always closed, preventing leaks!