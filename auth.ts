import NextAuth from "next-auth"

import authConfig from "./auth.config"

const authResponse = NextAuth(authConfig)

export const { handlers, auth, signIn, signOut } = authResponse
export const { GET, POST } = handlers
