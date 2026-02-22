"""
Adds is_admin and role columns to the users table.
Run once: python migrate_admin_columns.py
"""
from app.database.db import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE"))
        print("✅ is_admin kolonu eklendi")
    except Exception as e:
        if "already exists" in str(e) or "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
            print("ℹ️  is_admin zaten var, atlandı")
        else:
            print(f"⚠️  is_admin: {e}")

    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'"))
        print("✅ role kolonu eklendi")
    except Exception as e:
        if "already exists" in str(e) or "duplicate column" in str(e).lower():
            print("ℹ️  role zaten var, atlandı")
        else:
            print(f"⚠️  role: {e}")

    conn.commit()
    print("✅ Migration tamamlandı")
