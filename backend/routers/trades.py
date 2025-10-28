from fastapi import APIRouter, Body, HTTPException
from datetime import datetime, timezone
from db import init_db
from bson import ObjectId

router = APIRouter(prefix="/trades", tags=["trades"])

def now():
    return datetime.now(timezone.utc)

@router.post("/open")
async def open_trade(payload: dict = Body(...)):
    """
    payload = {
      "userId": "uid_123",
      "broker": "tradier",
      "symbol": "TSLA",
      "assetType": "option",
      "side": "buy",
      "quantity": 1,
      "multiplier": 100,
      "entryPrice": 12.25,
      "fees": 0.65,
      "openedAt": ISODate?, 
      "meta": { "optionType":"put","strike":435,"exp":"2025-10-31" }
    }
    """
    db = await init_db()
    doc = {
        **payload,
        "status": "open",
        "openedAt": payload.get("openedAt") or now()
    }
    res = await db.trades.insert_one(doc)
    return {"ok": True, "tradeId": str(res.inserted_id)}

@router.post("/close")
async def close_trade(payload: dict = Body(...)):
    """
    payload = {
      "tradeId": "...",
      "exitPrice": 15.05,
      "fees": 0.35,
      "closedAt": ISODate?
    }
    
    Calculates PnL based on position side:
    - Long: ((exitPrice - entryPrice) * quantity * multiplier) - fees
    - Short: ((entryPrice - exitPrice) * quantity * multiplier) - fees
    """
    db = await init_db()
    tid = payload.get("tradeId")
    if not tid:
        raise HTTPException(400, "tradeId required")
    
    trade = await db.trades.find_one({"_id": ObjectId(tid)})
    if not trade:
        raise HTTPException(404, "Trade not found")
    
    exit_price = payload["exitPrice"]
    close_fees = payload.get("fees", 0)
    
    entry_price = trade.get("entryPrice", 0)
    quantity = trade.get("quantity", 0)
    multiplier = trade.get("multiplier", 1)
    open_fees = trade.get("fees", 0)
    side = trade.get("side", "buy")
    
    # PnL calculation
    if side in ["buy", "long"]:
        # Long position: profit when exit > entry
        pnl = ((exit_price - entry_price) * quantity * multiplier) - open_fees - close_fees
    else:
        # Short position: profit when exit < entry
        pnl = ((entry_price - exit_price) * quantity * multiplier) - open_fees - close_fees
    
    # Calculate return percentage
    cost_basis = entry_price * quantity * multiplier
    return_pct = (pnl / cost_basis * 100) if cost_basis > 0 else 0
    
    set_fields = {
        "exitPrice": exit_price,
        "closedAt": payload.get("closedAt") or now(),
        "status": "closed",
        "pnl": round(pnl, 2),
        "returnPct": round(return_pct, 2)
    }
    
    # Accumulate fees
    await db.trades.update_one(
        {"_id": ObjectId(tid)},
        {
            "$set": set_fields,
            "$inc": {"fees": close_fees}
        }
    )
    
    return {
        "ok": True,
        "pnl": round(pnl, 2),
        "returnPct": round(return_pct, 2)
    }
