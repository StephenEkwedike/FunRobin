import { NextResponse } from "next/server"

import { hashPassword } from "@/lib/password"
import { getDb } from "@/lib/mongo"

function sanitize(input: string | null | undefined) {
  return input?.trim()
}

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()

    const normalizedEmail = sanitize(email)?.toLowerCase()
    const normalizedUsername = sanitize(username)
    const passwordValue = sanitize(password)

    if (!normalizedEmail || !passwordValue) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    if (passwordValue.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 })
    }

    const db = await getDb()
    const users = db.collection("users")

    const existing = await users.findOne({ email: normalizedEmail })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    if (normalizedUsername) {
      const usernameExists = await users.findOne({ usernameLower: normalizedUsername.toLowerCase() })
      if (usernameExists) {
        return NextResponse.json({ error: "That username is already taken." }, { status: 409 })
      }
    }

    const passwordHash = await hashPassword(passwordValue)

    await users.insertOne({
      email: normalizedEmail,
      username: normalizedUsername,
      usernameLower: normalizedUsername?.toLowerCase(),
      passwordHash,
      plan: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("[api/auth/signup]", error)
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 })
  }
}
