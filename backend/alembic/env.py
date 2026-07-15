import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- ADDED: make "app" importable, then pull in models + settings ---
sys.path.append(os.getcwd())

from app.models import Base
from app.core.config import settings

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# --- ADDED: use the real DB URL from .env instead of alembic.ini ---
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# --- CHANGED: was None, now points at your actual models ---
target_metadata = Base.metadata

# ... rest of the file stays exactly the same