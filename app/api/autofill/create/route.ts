import { type NextRequest, NextResponse } from "next/server"

// In-memory store for dev; use MongoDB with TTL in production
const store = globalThis as any
store.__FR_AF__ = store.__FR_AF__ ?? new Map<string, any>()

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const code = genCode()
    store.__FR_AF__.set(code, { payload, at: Date.now() })

    // Expire old entries (older than 2 minutes)
    for (const [k, v] of store.__FR_AF__.entries()) {
      if (Date.now() - v.at > 2 * 60 * 1000) {
        store.__FR_AF__.delete(k)
      }
    }

    return NextResponse.json({ code })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create autofill" }, { status: 500 })
  }
}
