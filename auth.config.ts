import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { getDb } from "@/lib/mongo"
import { verifyPassword } from "@/lib/password"

const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()?.toLowerCase()
        const username = credentials?.username?.trim()
        const password = credentials?.password ?? ""

        if (!email && !username) return null

        const db = await getDb()
        const users = db.collection("users")
        const user = await users.findOne(
          email ? { email } : { usernameLower: username?.toLowerCase() }
        )
        if (!user?.passwordHash) return null

        const ok = await verifyPassword(password, user.passwordHash)
        if (!ok) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username ?? user.name ?? undefined,
          plan: user.plan ?? "free",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id
        token.email = (user as any).email
        token.plan = (user as any).plan ?? "free"
      } else if (!token.plan && token.email) {
        try {
          const email = String(token.email).toLowerCase()
          const db = await getDb()
          const doc = await db.collection("users").findOne({ email })
          token.plan = doc?.plan ?? "free"
        } catch (error) {
          console.error("[auth.jwt] plan lookup failed", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = { email: token.email as string | undefined }
      }
      ;(session.user as any).id = token.sub
      ;(session.user as any).plan = token.plan ?? "free"
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
}

export default authConfig
