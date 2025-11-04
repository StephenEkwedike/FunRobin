"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X, Crown, Zap, TrendingUp, BarChart3, Award, Moon, Sun } from "lucide-react"

import { ProCtaButton } from "@/components/ProCtaButton"

export default function PricingPage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const features = [
    { name: "Live option updates", free: false, premium: true, icon: <Zap className="w-5 h-5" /> },
    { name: "Robinhood Auto-Fill", free: false, premium: true, icon: <TrendingUp className="w-5 h-5" /> },
    { name: "Multipliers up to 20x", free: false, premium: true, icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Leaderboard Eligibility", free: false, premium: true, icon: <Award className="w-5 h-5" /> },
    { name: 'Access to "HOT" grids', free: false, premium: true, icon: <Crown className="w-5 h-5" /> },
    { name: "Basic option browsing", free: true, premium: true, icon: <Check className="w-5 h-5" /> },
    { name: "Up to 10x multipliers", free: true, premium: true, icon: <Check className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <header className="border-b-4 border-black dark:border-purple-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 drop-shadow-[3px_3px_0_rgba(0,0,0,0.3)]">
              fun
            </h1>
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
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="font-bold text-gray-900 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="font-bold text-gray-900 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              Leaderboard
            </Link>
            <Link href="/pricing" className="font-bold text-purple-600 dark:text-purple-300 transition-colors">
              Pricing
            </Link>
          </nav>

          <button
            onClick={toggleDarkMode}
            className="p-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5 text-blue-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-8">
        {/* Hero Section */}
        <section className="text-center mb-12 p-8 bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[12px_12px_0_0_#000] dark:shadow-[12px_12px_0_0_#a855f7]">
          <div className="flex justify-center mb-4">
            <Crown className="w-16 h-16 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-purple-400">
            Go Beyond the Basics
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            FunRobin Premium gives you full access to instant fills, live pricing, and up to 20x multipliers.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="p-6 bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7] flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-purple-400">Free</h2>
                <p className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">$0</p>
                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.free ? (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${feature.free ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"}`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-4">
                <Link
                  href="/"
                  className="block w-full text-center px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="p-6 bg-gradient-to-br from-purple-500 to-blue-500 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7] relative flex flex-col h-full">
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] rotate-12">
                BEST VALUE
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 text-white">Premium</h2>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-white">$10</p>
                  <p className="text-white/80">per month</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.premium ? (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-purple-600" />
                        </div>
                      ) : (
                        <X className="w-5 h-5 text-white/40 flex-shrink-0" />
                      )}
                      <span className="text-sm text-white font-medium">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-4">
                <ProCtaButton className="w-full px-6 py-3 bg-white text-purple-600 font-bold border-3 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all">
                  Start 7-Day Free Trial
                </ProCtaButton>
                <p className="text-xs text-white/80 text-center mt-3">Credit card required. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Details */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white dark:bg-gray-900 border-3 border-black dark:border-purple-400 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#a855f7]">
            <Zap className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-purple-400">Live Updates</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Get real-time option pricing and instant notifications on hot opportunities.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 border-3 border-black dark:border-purple-400 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#a855f7]">
            <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-purple-400">Auto-Fill</h3>
            <p className="text-gray-700 dark:text-gray-300">
              One-click trading with automatic Robinhood order form filling via Chrome extension.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 border-3 border-black dark:border-purple-400 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#a855f7]">
            <Award className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-purple-400">Leaderboard</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Compete with other traders and showcase your wins on the global leaderboard.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="p-8 bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7]">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-purple-400 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                What's included in the free trial?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                You get full access to all Premium features for 7 days. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Can I cancel anytime?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes! Cancel your subscription at any time from your account settings. No questions asked.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Do you execute trades for me?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No. FunRobin is not a broker. We provide tools and auto-fill functionality, but you execute all trades
                manually on your Robinhood account.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black dark:border-purple-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="font-bold text-gray-900 dark:text-purple-400">© 2025 FunRobin | Trade Smart, Win Big 🚀</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/terms"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
