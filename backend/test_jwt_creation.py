from app.core.security import create_access_token, verify_token
from app.users.user_model import User

print("🔐 Testing JWT Token Creation and Verification...")

try:
    # Test token creation
    print("\n1. Creating JWT token...")
    test_data = {"sub": "test@example.com", "user_id": 1}
    token = create_access_token(data=test_data)
    
    print(f"✅ Token created successfully")
    print(f"🔑 Token (first 50 chars): {token[:50]}...")
    print(f"📏 Token length: {len(token)}")
    
    # Test token verification
    print("\n2. Verifying JWT token...")
    payload = verify_token(token)
    
    if payload:
        print(f"✅ Token verified successfully")
        print(f"📋 Payload: {payload}")
    else:
        print("❌ Token verification failed")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n🎯 Test completed!")
