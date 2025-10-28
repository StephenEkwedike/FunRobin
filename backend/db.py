import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB  = os.getenv("MONGO_DB",  "funrobin")

client: AsyncIOMotorClient | None = None
db = None

async def init_db():
    global client, db
    if client is None:
        client = AsyncIOMotorClient(MONGO_URI)
        db = client[MONGO_DB]
        # indexes (idempotent)
        await db.trades.create_index([("userId", 1)])
        await db.trades.create_index([("status", 1), ("closedAt", -1)])
        await db.trades.create_index([("openedAt", -1)])
        await db.users.create_index([("_id", 1)])
    return db
