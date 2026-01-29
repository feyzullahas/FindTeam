from app.database.db import engine, Base
from app.users.user_model import User
from app.posts.post_model import Post

def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        print("📋 Created tables:")
        print("   - users")
        print("   - posts")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    create_tables()
