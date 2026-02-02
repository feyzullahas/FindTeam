import requests
import json

# Test post creation with minimal data
test_data = {
    "title": "Test Post",
    "description": "Test description",
    "post_type": "team",
    "city": "İstanbul",
    "positions_needed": [],
    "match_time": None,
    "contact_info": {
        "phone": "05551234567",
        "email": ""
    }
}

try:
    # First, let's try without authentication to see the exact error
    response = requests.post(
        "http://localhost:8000/posts/",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
