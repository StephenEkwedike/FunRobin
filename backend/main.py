from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import init_db
from routers import leaderboard, trades

app = FastAPI(title="FunRobin API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://funrobin.com"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

app.include_router(trades.router)
app.include_router(leaderboard.router)

@app.on_event("startup")
async def _start():
    await init_db()

@app.get("/health")
async def health():
    return {"status": "ok"}
