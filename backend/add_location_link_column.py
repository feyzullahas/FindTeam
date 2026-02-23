"""
Migration: posts tablosuna location_link kolonu ekle
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

print("🔄 location_link kolonu ekleniyor...")

try:
    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        db_url = settings.DATABASE_URL.lower()

        # SQLite
        if "sqlite" in db_url:
            result = conn.execute(text("PRAGMA table_info(posts)"))
            columns = [row[1] for row in result.fetchall()]
            if "location_link" in columns:
                print("✅ 'location_link' kolonu zaten mevcut.")
            else:
                conn.execute(text("ALTER TABLE posts ADD COLUMN location_link TEXT"))
                conn.commit()
                print("✅ 'location_link' kolonu başarıyla eklendi (SQLite).")

        # PostgreSQL
        elif "postgresql" in db_url or "postgres" in db_url:
            result = conn.execute(text("""
                SELECT column_name FROM information_schema.columns
                WHERE table_name = 'posts' AND column_name = 'location_link'
            """))
            if result.fetchone():
                print("✅ 'location_link' kolonu zaten mevcut.")
            else:
                conn.execute(text("ALTER TABLE posts ADD COLUMN location_link VARCHAR(500)"))
                conn.commit()
                print("✅ 'location_link' kolonu başarıyla eklendi (PostgreSQL).")

        # MySQL / MariaDB
        else:
            result = conn.execute(text("""
                SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = 'posts' AND COLUMN_NAME = 'location_link'
            """))
            if result.fetchone():
                print("✅ 'location_link' kolonu zaten mevcut.")
            else:
                conn.execute(text("ALTER TABLE posts ADD COLUMN location_link VARCHAR(500)"))
                conn.commit()
                print("✅ 'location_link' kolonu başarıyla eklendi (MySQL).")

except Exception as e:
    print(f"❌ Hata: {e}")
    sys.exit(1)
