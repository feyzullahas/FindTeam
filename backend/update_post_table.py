import pymysql
from sqlalchemy import create_engine, text
from app.core.config import settings

print("🔄 Updating Post table structure...")

try:
    # Connect to database
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Check if contact_phone column exists
        result = conn.execute(text("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'posts' 
            AND COLUMN_NAME = 'contact_phone'
        """))
        
        contact_phone_exists = result.fetchone() is not None
        
        if contact_phone_exists:
            print("📋 contact_phone column exists, adding contact_info column...")
            
            # Add contact_info column
            conn.execute(text("""
                ALTER TABLE posts 
                ADD COLUMN contact_info JSON
            """))
            
            # Migrate data from contact_phone to contact_info
            conn.execute(text("""
                UPDATE posts 
                SET contact_info = JSON_OBJECT('phone', contact_phone, 'email', '')
                WHERE contact_phone IS NOT NULL
            """))
            
            # Drop contact_phone column
            conn.execute(text("""
                ALTER TABLE posts 
                DROP COLUMN contact_phone
            """))
            
            conn.commit()
            print("✅ Migration completed successfully!")
        else:
            print("✅ contact_info column already exists")
            
        # Verify table structure
        result = conn.execute(text("DESCRIBE posts"))
        columns = result.fetchall()
        print("📋 Current table structure:")
        for column in columns:
            print(f"  - {column[0]}: {column[1]}")

except Exception as e:
    print(f"❌ Migration error: {e}")
    import traceback
    traceback.print_exc()

print("\n🎯 Migration completed!")
