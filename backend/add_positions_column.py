import pymysql
from sqlalchemy import create_engine, text
from app.core.config import settings

def add_positions_column():
    """Add positions column to users table"""
    try:
        # Direct pymysql connection for ALTER TABLE
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='database9876',
            database='findteam',
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Check if column already exists
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'findteam' 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'positions'
        """)
        
        result = cursor.fetchone()
        
        if result:
            print("✅ 'positions' column already exists in users table")
        else:
            # Add the column
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN positions JSON NULL
            """)
            
            connection.commit()
            print("✅ 'positions' column added successfully to users table")
        
        cursor.close()
        connection.close()
        
        # Test SQLAlchemy connection
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("DESCRIBE users"))
            columns = [row[0] for row in result]
            if 'positions' in columns:
                print("✅ SQLAlchemy can see the positions column")
            else:
                print("❌ SQLAlchemy cannot see the positions column")
                
    except Exception as e:
        print(f"❌ Error adding positions column: {e}")

if __name__ == "__main__":
    add_positions_column()
