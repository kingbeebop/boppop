import base64
from datetime import date, datetime

def encode_cursor(value: str) -> str:
    """Encode a cursor value to base64."""
    return base64.b64encode(str(value).encode()).decode()

def decode_cursor(cursor: str) -> str:
    """Decode a base64 cursor back to its original value."""
    return base64.b64decode(cursor.encode()).decode()

def encode_date_cursor(d: date) -> str:
    """Encode a date as a cursor."""
    return encode_cursor(d.isoformat())

def decode_date_cursor(cursor: str) -> date:
    """Decode a cursor back to a date."""
    date_str = decode_cursor(cursor)
    return date.fromisoformat(date_str)

def encode_datetime_cursor(dt: datetime) -> str:
    """Encode a datetime as a cursor."""
    return encode_cursor(dt.isoformat())

def decode_datetime_cursor(cursor: str) -> datetime:
    """Decode a cursor back to a datetime."""
    dt_str = decode_cursor(cursor)
    return datetime.fromisoformat(dt_str) 