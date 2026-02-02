import pymysql
from sqlalchemy import create_engine, text
from app.core.config import settings

def add_match_time_column():
    """Add match_time column to posts table"""
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
            AND TABLE_NAME = 'posts' 
            AND COLUMN_NAME = 'match_time'
        """)
        
        result = cursor.fetchone()
        
        if result:
            print("✅ 'match_time' column already exists in posts table")
        else:
            # Add the column
            cursor.execute("""
                ALTER TABLE posts 
                ADD COLUMN match_time VARCHAR(50) NULL
            """)
            
            connection.commit()
            print("✅ 'match_time' column added successfully to posts table")
        
        cursor.close()
        connection.close()
        
        # Test SQLAlchemy connection
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("DESCRIBE posts"))
            columns = [row[0] for row in result]
            if 'match_time' in columns:
                print("✅ SQLAlchemy can see the match_time column")
            else:
                print("❌ SQLAlchemy cannot see the match_time column")
                
    except Exception as e:
        print(f"❌ Error adding match_time column: {e}")

if __name__ == "__main__":
    add_match_time_column()
