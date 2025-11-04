import { NextResponse } from "next/server"

import { auth } from "@/auth"

const GUARDED_ROUTES = new Set([
  "/api/autofill/create",
  "/api/options/live",
  "/api/grids/hot",
  "/api/leaderboard/submit",
  "/api/trades/execute",
])

export default auth(
  (req) => {
    const path = req.nextUrl.pathname

    const isProNamespace = path.startsWith("/api/pro/") || path === "/api/pro"
    const isGuardedRoute = GUARDED_ROUTES.has(path) || path.startsWith("/api/risk/")

    if (!(isProNamespace || isGuardedRoute)) {
      return NextResponse.next()
    }

    const plan =
      (req.auth as any)?.user?.plan ??
      (req.auth as any)?.plan ??
      "free"

    if (plan !== "pro") {
      return NextResponse.json(
        { error: "Upgrade required", hint: "Subscribe to FunRobin Pro for this feature." },
        { status: 402 }
      )
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/api/pro/:path*",
    "/api/autofill/create",
    "/api/options/live",
    "/api/risk/:path*",
    "/api/grids/hot",
    "/api/leaderboard/submit",
    "/api/trades/execute",
  ],
}
