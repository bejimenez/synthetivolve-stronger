import os
import sys
from logging.config import fileConfig

from dotenv import load_dotenv
from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- 1. Path Setup for a Clean Import ---
# This is a crucial step to ensure that Alembic can find your application's modules.
# It adds the parent directory (which contains the 'app' folder) to the Python path.
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# --- 2. Load Environment Variables ---
# This ensures that the DATABASE_URL from your .env file is available.
load_dotenv()

# --- Standard Alembic Configuration ---
# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- 3. Connect to Your Application's Models ---
# This is the most important change. We need to tell Alembic what tables
# our application has.
#
# Import the base class that all your SQLAlchemy models will inherit from.
from app.db.base import Base
# Import all of your model files here. This is necessary so that
# their definitions are registered with the Base.metadata object.
from app.db.models import user, nutrition, fitness, biometrics

# Set the target_metadata to your Base's metadata object.
# Alembic uses this to compare your models with the current database schema.
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,  # Use our app's metadata
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # --- 4. Handle the Async Database Driver ---
    # We get the configuration section from alembic.ini
    ini_section = config.get_section(config.config_ini_section)
    
    # We get the DATABASE_URL from the ini file (which reads it from .env)
    url = ini_section['sqlalchemy.url']

    # Your app uses an async driver 'aiosqlite', but Alembic is a synchronous
    # tool. We replace the async driver with its sync equivalent for the
    # migration process only.
    if "sqlite+aiosqlite" in url:
        url = url.replace("sqlite+aiosqlite", "sqlite")
    
    ini_section['sqlalchemy.url'] = url
    
    connectable = engine_from_config(
        ini_section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata  # Use our app's metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()