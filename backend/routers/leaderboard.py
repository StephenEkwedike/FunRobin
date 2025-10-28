from fastapi import APIRouter, Query
from datetime import datetime, timedelta, timezone
from db import init_db
from typing import Literal

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

Window = Literal["all", "daily", "weekly", "monthly"]
Metric = Literal["pnl", "return_pct"]   # $ PnL or % return

def window_range(win: Window):
    now = datetime.now(timezone.utc)
    if win == "daily":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        return start, now
    if win == "weekly":
        # week starts Monday
        start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
        return start, now
    if win == "monthly":
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return start, now
    return None, None  # all-time

@router.get("")
async def get_leaderboard(
    window: Window = Query("all"),
    metric: Metric = Query("pnl"),
    limit: int = Query(50, ge=1, le=200)
):
    """
    Returns rows like:
    {
      userId, trades, wins, winRate, pnl, cost, returnPct, lastTradeAt,
      // optional denormals:
      user: { displayName, avatarUrl }
    }
    """
    db = await init_db()
    start, end = window_range(window)

    match_stage = {
        "status": "closed"
    }
    if start and end:
        match_stage["closedAt"] = {"$gte": start, "$lte": end}

    # Compute realized PnL for each trade on the fly.
    # sign = +1 for long buys, -1 for shorts
    pipeline = [
        {"$match": match_stage},
        {"$addFields": {
            "mult": {"$ifNull": ["$multiplier", 1]},
            "qty": {"$ifNull": ["$quantity", 0]},
            "fee": {"$ifNull": ["$fees", 0]},
            "entry": {"$ifNull": ["$entryPrice", 0]},
            "exit": {"$ifNull": ["$exitPrice", 0]},
            "sign": {
                "$cond": [
                    {"$eq": ["$side", "buy"]},  # opening long → profit when exit > entry
                    1,
                    -1                          # opening short → profit when exit < entry
                ]
            }
        }},
        {"$addFields": {
            "pnl": {
                "$subtract": [
                    {"$multiply": [{"$multiply": [{"$multiply": [{"$subtract": ["$exit", "$entry"]}, "$qty"]}, "$mult"]}, "$sign"]},
                    "$fee"
                ]
            },
            "costBasis": {"$abs": {"$multiply": ["$entry", "$qty", "$mult"]}},
            "win": {"$cond": [{"$gt": ["$pnl", 0]}, 1, 0]}
        }},
        {"$group": {
            "_id": "$userId",
            "trades": {"$sum": 1},
            "wins": {"$sum": "$win"},
            "pnl": {"$sum": "$pnl"},
            "cost": {"$sum": "$costBasis"},
            "lastTradeAt": {"$max": "$closedAt"}
        }},
        {"$addFields": {
            "winRate": {"$cond": [{"$gt": ["$trades", 0]}, {"$divide": ["$wins", "$trades"]}, 0]},
            "returnPct": {"$cond": [{"$gt": ["$cost", 0]}, {"$divide": ["$pnl", "$cost"]}, 0]}
        }},
        # optional: join minimal user profile for display
        {"$lookup": {
            "from": "users",
            "localField": "_id",
            "foreignField": "_id",
            "as": "user"
        }},
        {"$unwind": {"path": "$user", "preserveNullAndEmptyArrays": True}},
        # shape output
        {"$project": {
            "_id": 0,
            "userId": "$_id",
            "trades": 1,
            "wins": 1,
            "winRate": 1,
            "pnl": 1,
            "cost": 1,
            "returnPct": 1,
            "lastTradeAt": 1,
            "user.displayName": 1,
            "user.avatarUrl": 1,
            "user.handle": 1
        }},
        {"$sort": {("returnPct" if metric == "return_pct" else "pnl"): -1, "trades": -1}},
        {"$limit": limit}
    ]

    rows = await db.trades.aggregate(pipeline).to_list(length=limit)
    return {"window": window, "metric": metric, "rows": rows}
