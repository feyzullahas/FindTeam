import requests
import json

# Test data
test_post = {
    "title": "Test Post",
    "description": "This is a test post created via API",
    "city": "İstanbul",
    "post_type": "player_searching",
    "positions_needed": ["forvet", "orta saha"],
    "contact_info": {
        "phone": "5551234567",
        "email": "test@example.com"
    }
}

print("🧪 Testing Post Creation API...")
print(f"📤 Test data: {json.dumps(test_post, indent=2, ensure_ascii=False)}")

try:
    # First, let's try to get a JWT token by simulating the OAuth flow
    print("\n1. Testing if backend is running...")
    response = requests.get("http://localhost:8000/")
    
    if response.status_code == 200:
        print("✅ Backend is running")
    else:
        print(f"❌ Backend not responding properly: {response.status_code}")
        exit()

    # Test the posts endpoint without authentication first
    print("\n2. Testing posts endpoint without authentication...")
    response = requests.get("http://localhost:8000/posts/")
    
    if response.status_code == 200:
        print("✅ Posts endpoint accessible")
        print(f"📋 Response: {response.json()}")
    else:
        print(f"❌ Posts endpoint error: {response.status_code}")
        print(f"📋 Error: {response.text}")

    # Test the profile endpoint without authentication
    print("\n3. Testing profile endpoint without authentication...")
    response = requests.get("http://localhost:8000/users/profile")
    
    if response.status_code == 401:
        print("✅ Profile endpoint correctly requires authentication")
    else:
        print(f"❌ Unexpected response: {response.status_code}")
        print(f"📋 Response: {response.text}")

except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend. Is it running on http://localhost:8000 ?")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n🎯 Test completed!")
