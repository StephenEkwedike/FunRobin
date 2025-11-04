import { auth } from "@/auth"

export async function requirePro() {
  const session = await auth()
  if (!session) {
    return { error: "Not authenticated", status: 401 as const }
  }

  const plan = (session.user as any)?.plan ?? "free"
  if (plan !== "pro") {
    return { error: "Upgrade required", status: 402 as const }
  }

  return { session }
}
