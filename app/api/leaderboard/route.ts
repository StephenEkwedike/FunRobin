import { NextResponse } from "next/server"

// Mock leaderboard data - in production, this would query MongoDB
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const window = searchParams.get("window") || "all"
  const metric = searchParams.get("metric") || "pnl"
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  // Mock data - replace with actual MongoDB aggregation
  const mockData = {
    window,
    metric,
    rows: [
      {
        userId: "1",
        displayName: "Jacob Jones",
        handle: "jacob_99",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jacob",
        pnl: 880.43,
        winRate: 0.05,
        profit: 283789,
        followers: 1400,
        walletAddress: "0x5095a40...679a9659",
        trades: 142,
      },
      // Add more mock entries as needed
    ],
  }

  return NextResponse.json(mockData)
}
