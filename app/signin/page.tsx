"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { signIn } from "next-auth/react"

export default function SignInPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = useMemo(() => searchParams?.get("callbackUrl") ?? "/", [searchParams])

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await signIn("credentials", {
      redirect: false,
      username: username || undefined,
      email: email || undefined,
      password: password || undefined,
      callbackUrl,
    })

    setIsSubmitting(false)

    if (result?.error) {
      setError("Invalid email or password.")
      return
    }

    const url = result?.url ?? callbackUrl
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-black transition-colors duration-200 flex items-center justify-center p-4">
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all z-50"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="w-5 h-5 text-blue-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
      </button>

      <main className="w-full max-w-md">
        <div className="p-8 bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[12px_12px_0_0_#000] dark:shadow-[12px_12px_0_0_#a855f7]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400">fun</h1>
            <div className="w-12 h-12 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center p-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-purple-600 dark:text-purple-400">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-purple-400 text-center">Sign in to FunRobin</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">Start trading options with one click</p>

          {error && <p className="mb-4 text-sm font-semibold text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black dark:border-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Username (optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black dark:border-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="trader_jane"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black dark:border-purple-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-purple-600 text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-purple-600 dark:hover:text-purple-400">
                Terms of Service
              </Link>{" "}and{" "}
              <Link href="/privacy" className="underline hover:text-purple-600 dark:hover:text-purple-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-bold">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
