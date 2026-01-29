import pymysql
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Database URL
DATABASE_URL = "mysql+pymysql://root:database9876@localhost/findteam"

print("🔍 Testing MySQL Database Connection...")
print(f"Database URL: {DATABASE_URL}")

try:
    # 1. Direct pymysql connection test
    print("\n1. Testing direct pymysql connection...")
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='database9876',
        database='findteam',
        charset='utf8mb4'
    )
    print("✅ Direct pymysql connection successful!")
    
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(f"📋 Tables in database: {[table[0] for table in tables]}")
    
    connection.close()

except Exception as e:
    print(f"❌ Direct pymysql connection failed: {e}")

try:
    # 2. SQLAlchemy connection test
    print("\n2. Testing SQLAlchemy connection...")
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        result = conn.execute(text("SHOW TABLES;"))
        tables = result.fetchall()
        print(f"📋 Tables via SQLAlchemy: {[table[0] for table in tables]}")
        
        # Test if users table exists and has data
        if any('user' in str(table).lower() for table in tables):
            result = conn.execute(text("SELECT COUNT(*) FROM users;"))
            user_count = result.scalar()
            print(f"👥 Users count: {user_count}")
        
        # Test if posts table exists and has data
        if any('post' in str(table).lower() for table in tables):
            result = conn.execute(text("SELECT COUNT(*) FROM posts;"))
            post_count = result.scalar()
            print(f"📝 Posts count: {post_count}")
    
    print("✅ SQLAlchemy connection successful!")

except SQLAlchemyError as e:
    print(f"❌ SQLAlchemy connection failed: {e}")
except Exception as e:
    print(f"❌ Unexpected error: {e}")

print("\n🎯 Test completed!")
