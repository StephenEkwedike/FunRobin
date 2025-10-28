"use client"

import { useState } from "react"
import Link from "next/link"
import { Moon, Sun, Check } from "lucide-react"

export default function SignUp() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleGoogleSignUp = () => {
    // TODO: Implement NextAuth Google OAuth
    console.log("[v0] Google sign up clicked")
  }

  const handleDevSignUp = () => {
    const username = prompt("Username") || ""
    // TODO: Implement NextAuth credentials signup
    console.log("[v0] Dev signup with username:", username)
  }

  const benefits = [
    "Browse live options grids",
    "Up to 10x multipliers (free tier)",
    "Bird chirp + confetti on trades",
    "Upgrade anytime to Premium",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-black transition-colors duration-200 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all z-50"
      >
        {darkMode ? <Sun className="w-5 h-5 text-blue-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
      </button>

      <main className="w-full max-w-md">
        <div className="p-8 bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[12px_12px_0_0_#000] dark:shadow-[12px_12px_0_0_#a855f7]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400">fun</h1>
            <div className="w-12 h-12 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center p-2">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full text-purple-600 dark:text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-purple-400 text-center">
            Join FunRobin Today
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Start trading options with gamified one-click execution
          </p>

          {/* Benefits */}
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700">
            <p className="text-xs font-bold text-purple-900 dark:text-purple-400 mb-3">What you get for free:</p>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleSignUp}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleDevSignUp}
              className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
            >
              Dev signup
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/signin" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-purple-600 dark:hover:text-purple-400">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-purple-600 dark:hover:text-purple-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-bold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
