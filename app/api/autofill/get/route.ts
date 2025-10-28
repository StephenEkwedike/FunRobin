import { type NextRequest, NextResponse } from "next/server"

const store = globalThis as any

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") || ""
  const rec = store.__FR_AF__?.get(code)

  if (!rec) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  // One-time use: delete after retrieval
  store.__FR_AF__.delete(code)

  return NextResponse.json(rec.payload)
}
