import { type NextRequest, NextResponse } from "next/server"

import { ensureIndexes } from "@/lib/bootstrap"
import { colAutofill } from "@/lib/mongo"
import { requirePro } from "@/lib/require-pro"

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const gate = await requirePro()
    if (gate.error) {
      return NextResponse.json({ error: gate.error }, { status: gate.status })
    }

    const payload = await req.json()
    const code = genCode()

    await ensureIndexes()
    const coll = await colAutofill()
    await coll.insertOne({ code, payload, createdAt: new Date() })

    return NextResponse.json({ code })
  } catch (error) {
    console.error("[api/autofill/create] failed", error)
    return NextResponse.json({ error: "Failed to create autofill" }, { status: 500 })
  }
}
