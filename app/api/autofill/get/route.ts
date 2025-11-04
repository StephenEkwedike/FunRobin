import { type NextRequest, NextResponse } from "next/server"

import { ensureIndexes } from "@/lib/bootstrap"
import { colAutofill } from "@/lib/mongo"

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code")?.trim()?.toUpperCase()
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    await ensureIndexes()
    const coll = await colAutofill()
    const result = await coll.findOneAndDelete({ code })

    if (!result.value) {
      return NextResponse.json({ ok: false }, { status: 404 })
    }

    return NextResponse.json(result.value.payload)
  } catch (error) {
    console.error("[api/autofill/get] failed", error)
    return NextResponse.json({ error: "Failed to load autofill" }, { status: 500 })
  }
}
