"""
Database migration script to add is_admin column to users table
"""
import sys
import os

# Backend dizinini Python path'e ekle
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database.db import engine

def migrate():
    """Add is_admin column to users table"""
    try:
        with engine.connect() as conn:
            # Check if column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='is_admin';
            """))
            
            if result.fetchone():
                print("✓ is_admin kolonu zaten mevcut")
                return True
            
            # Add the column
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
            """))
            conn.commit()
            
            print("✅ is_admin kolonu başarıyla eklendi")
            return True
            
    except Exception as e:
        print(f"❌ Migration hatası: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("📊 Database Migration: Add is_admin column")
    print("=" * 50)
    print()
    
    if migrate():
        print("\n✨ Migration başarılı!")
    else:
        print("\n❌ Migration başarısız!")
        sys.exit(1)
