from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.database.base import Base

# Create database engine
db_url = settings.DATABASE_URL
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Configure connection pool to handle idle connections
engine = create_engine(
    db_url,
    pool_pre_ping=True,  # Test connections before using them
    pool_recycle=600,    # Recycle connections after 10 minutes
    pool_size=5,         # Number of connections to maintain
    max_overflow=10,     # Maximum extra connections
    connect_args={
        "connect_timeout": 10,  # Connection timeout in seconds
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5
    }
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
#Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
