from sqlalchemy import text
from db.session import AsyncSessionLocal

async def check_db_health():
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            return True
    except Exception:
        return False