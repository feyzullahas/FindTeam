import json
from typing import List, Any

def positions_to_json(positions: List[str]) -> str:
    """Convert list of positions to JSON string"""
    return json.dumps(positions)

def json_to_positions(positions_json: str) -> List[str]:
    """Convert JSON string to list of positions"""
    if not positions_json:
        return []
    try:
        return json.loads(positions_json)
    except json.JSONDecodeError:
        return []

def validate_positions(positions: List[str]) -> List[str]:
    """Validate and clean positions list"""
    valid_positions = ["Kaleci", "Defans", "Orta Saha", "Forvet"]
    return [pos for pos in positions if pos in valid_positions]

def format_phone_number(phone: str) -> str:
    """Format phone number to Turkish format"""
    # Remove all non-digit characters
    digits_only = ''.join(filter(str.isdigit, phone))
    
    # Check if it's a valid Turkish phone number
    if len(digits_only) == 10:
        return f"0{digits_only}"
    elif len(digits_only) == 11 and digits_only.startswith('0'):
        return digits_only
    elif len(digits_only) == 11 and digits_only.startswith('90'):
        return f"0{digits_only[2:]}"
    else:
        return phone  # Return original if format is unexpected
