import sys
import json
sys.path.append('.')
from app.database.db import SessionLocal
from app.posts.post_model import Post
from app.posts.post_schema import PostCreate
from app.users.user_model import User

# Test the exact same logic as the API
db = SessionLocal()
try:
    # Get a user
    user = db.query(User).first()
    if not user:
        print('No users found')
        sys.exit(1)
    
    print(f'Testing with user: {user.email} (ID: {user.id})')
    
    # Create PostCreate object (same as API receives)
    post_create = PostCreate(
        title="Test Post",
        description="Test description", 
        post_type="team",
        city="İstanbul",
        positions_needed=[],
        match_time=None,
        contact_info={
            "phone": "05551234567",
            "email": ""
        }
    )
    
    print(f'PostCreate object: {post_create.dict()}')
    
    # Simulate the API logic
    post_data = post_create.dict()
    print(f'post_data before processing: {post_data}')
    
    # Handle positions_needed
    if post_data.get("positions_needed") and len(post_data["positions_needed"]) > 0:
        post_data["positions_needed"] = json.dumps(post_data["positions_needed"])
        print(f'positions_needed after JSON dump: {post_data["positions_needed"]}')
    else:
        post_data["positions_needed"] = None
        print('positions_needed set to None')
    
    # Handle contact_info
    if post_data.get("contact_info"):
        print(f'contact_info: {post_data["contact_info"]}')
    
    print(f'post_data before creating Post: {post_data}')
    
    # Create Post object (this is where the error might occur)
    db_post = Post(**post_data, user_id=user.id)
    print('Post object created successfully!')
    
    # Try to save to database
    db.add(db_post)
    db.commit()
    print('Post saved to database successfully!')
    
    # Clean up
    db.delete(db_post)
    db.commit()
    print('Post cleaned up successfully!')
    
except Exception as e:
    print(f'Error occurred: {e}')
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()
