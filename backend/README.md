# FunRobin Backend API

FastAPI + MongoDB backend for FunRobin leaderboard and trade tracking.

## Setup

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Set environment variables:
\`\`\`bash
export MONGO_URI="mongodb://localhost:27017"
export MONGO_DB="funrobin"
\`\`\`

3. Run the server:
\`\`\`bash
uvicorn main:app --reload --port 8000
\`\`\`

## API Endpoints

### Trades
- `POST /trades/open` - Open a new trade
- `POST /trades/close` - Close an existing trade

### Leaderboard
- `GET /leaderboard?window=all&metric=pnl&limit=50` - Get leaderboard rankings

**Window options:** `all`, `daily`, `weekly`, `monthly`
**Metric options:** `pnl` (total profit/loss), `return_pct` (percentage return)

## Trade Document Schema

\`\`\`json
{
  "_id": "...",
  "userId": "uid_123",
  "broker": "tradier" | "alpaca" | "robinhood",
  "symbol": "TSLA",
  "assetType": "option" | "equity",
  "side": "buy" | "sell",
  "quantity": 1,
  "multiplier": 100,
  "entryPrice": 12.25,
  "exitPrice": 15.05,
  "fees": 0.65,
  "status": "open" | "closed" | "canceled" | "rejected",
  "openedAt": "2025-10-24T...",
  "closedAt": "2025-10-24T...",
  "strategy": "preset_id_xyz",
  "meta": {}
}
\`\`\`

## Example Usage

### Open a trade
\`\`\`bash
curl -X POST http://localhost:8000/trades/open \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "broker": "robinhood",
    "symbol": "AAPL",
    "assetType": "option",
    "side": "buy",
    "quantity": 1,
    "multiplier": 100,
    "entryPrice": 180.50,
    "fees": 0.65
  }'
\`\`\`

### Close a trade
\`\`\`bash
curl -X POST http://localhost:8000/trades/close \
  -H "Content-Type: application/json" \
  -d '{
    "tradeId": "67890abcdef",
    "exitPrice": 195.25,
    "fees": 0.35
  }'
\`\`\`

### Get leaderboard
\`\`\`bash
curl "http://localhost:8000/leaderboard?window=monthly&metric=pnl&limit=20"
