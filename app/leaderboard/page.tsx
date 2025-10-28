"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Moon, Sun, X, Zap, Copy, Check } from "lucide-react"

// ============================================
// TYPES
// ============================================
type TimeWindow = "all" | "daily" | "weekly" | "monthly"

type LeaderboardEntry = {
  userId: string
  rank: number
  displayName: string
  handle: string
  avatarUrl: string
  pnl: number
  winRate: number
  profit: number
  followers: number
  walletAddress: string
  trades: number
}

// ============================================
// UTILITY COMPONENTS
// ============================================

const ThemeToggle: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => (
  <button
    onClick={toggleDarkMode}
    className="p-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
  >
    {darkMode ? <Sun className="w-5 h-5 text-blue-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
  </button>
)

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
      aria-label="Copy wallet address"
    >
      {copied ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <Copy size={16} className="text-gray-500 dark:text-gray-400" />
      )}
    </button>
  )
}

// ============================================
// MAIN COMPONENTS
// ============================================

const TopTraderCard: React.FC<{ entry: LeaderboardEntry; highlighted?: boolean }> = ({
  entry,
  highlighted = false,
}) => {
  return (
    <div
      className={`p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-4 ${
        highlighted ? "border-purple-500 dark:border-purple-400" : "border-black dark:border-purple-400"
      } shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7] backdrop-blur-sm relative`}
    >
      {/* Rank badge */}
      <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 border-3 border-black dark:border-purple-400 shadow-[3px_3px_0_0_#000] dark:shadow-[3px_3px_0_0_#a855f7] flex items-center justify-center">
        <span className="text-white font-bold text-lg">#{entry.rank}</span>
      </div>

      {/* Profile section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full border-3 border-black dark:border-purple-400 overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400">
            <img
              src={entry.avatarUrl || "/placeholder.svg"}
              alt={entry.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{entry.displayName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{entry.handle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-black dark:bg-gray-800 border-2 border-black dark:border-purple-400 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          <button className="p-2 bg-blue-500 border-2 border-black dark:border-purple-400 hover:bg-blue-600 transition-colors">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">PNL</p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400">+{entry.pnl.toFixed(2)} SOL</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">FOLLOWERS</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{(entry.followers / 1000).toFixed(1)}k</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">WIN RATE</p>
          <p className="text-sm font-bold text-blue-500 dark:text-blue-400">{(entry.winRate * 100).toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">PROFIT</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">${entry.profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Wallet address */}
      <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-purple-400">
        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{entry.walletAddress}</span>
        <CopyButton text={entry.walletAddress} />
      </div>
    </div>
  )
}

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry }> = ({ entry }) => {
  return (
    <tr className="border-b-2 border-gray-200 dark:border-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
      <td className="py-4 px-4 text-center">
        <span className="font-bold text-gray-900 dark:text-white">{entry.rank}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-black dark:border-purple-400 overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400">
            <img
              src={entry.avatarUrl || "/placeholder.svg"}
              alt={entry.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{entry.displayName}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">@{entry.handle}</p>
          </div>
          <div className="flex gap-1 ml-2">
            <button className="p-1 bg-black dark:bg-gray-800 border border-black dark:border-purple-400 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button className="p-1 bg-blue-500 border border-black dark:border-purple-400 hover:bg-blue-600 transition-colors">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </button>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">SOL</span>
        <p className="font-bold text-gray-900 dark:text-white">{entry.pnl.toFixed(3)}</p>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="font-bold text-blue-500 dark:text-blue-400">{(entry.winRate * 100).toFixed(1)}%</span>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="font-bold text-gray-900 dark:text-white">${entry.profit.toLocaleString()}</span>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="font-bold text-gray-900 dark:text-white">{(entry.followers / 1000).toFixed(1)}k</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{entry.walletAddress}</span>
          <CopyButton text={entry.walletAddress} />
        </div>
      </td>
    </tr>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function LeaderboardPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("all")

  useEffect(() => {
    console.log("[v0] Leaderboard page mounted")
    // Check if dark mode is already enabled
    if (document.documentElement.classList.contains("dark")) {
      setDarkMode(true)
    }
  }, [])

  // Mock leaderboard data
  const [leaderboardData] = useState<LeaderboardEntry[]>([
    {
      userId: "1",
      rank: 1,
      displayName: "Jacob Jones",
      handle: "jacob_99",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jacob",
      pnl: 880.43,
      winRate: 0.05,
      profit: 283789,
      followers: 1400,
      walletAddress: "0x5095a40...679a9659",
      trades: 142,
    },
    {
      userId: "2",
      rank: 2,
      displayName: "Robert Fox",
      handle: "foxy_rob",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      pnl: 880.43,
      winRate: 0.05,
      profit: 283789,
      followers: 1500,
      walletAddress: "0x5095a40...679a9659",
      trades: 138,
    },
    {
      userId: "3",
      rank: 3,
      displayName: "Albert Flores",
      handle: "albert_02",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Albert",
      pnl: 880.43,
      winRate: 0.05,
      profit: 283789,
      followers: 1300,
      walletAddress: "0x5095a40...679a9659",
      trades: 135,
    },
    {
      userId: "4",
      rank: 4,
      displayName: "Cupsey",
      handle: "johnsmith0",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cupsey",
      pnl: 880.439,
      winRate: 0.048,
      profit: 170894.3,
      followers: 1100,
      walletAddress: "0x5095a40...679a9659",
      trades: 128,
    },
    {
      userId: "5",
      rank: 5,
      displayName: "Cented",
      handle: "johnsmith0",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cented",
      pnl: 880.439,
      winRate: 0.047,
      profit: 170894.3,
      followers: 1100,
      walletAddress: "0x5095a40...679a9659",
      trades: 125,
    },
    {
      userId: "6",
      rank: 6,
      displayName: "Jalen",
      handle: "jaly",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jalen",
      pnl: 880.439,
      winRate: 0.046,
      profit: 170894.3,
      followers: 1100,
      walletAddress: "0x5095a40...679a9659",
      trades: 122,
    },
    {
      userId: "7",
      rank: 7,
      displayName: "Marcell",
      handle: "marc",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcell",
      pnl: 880.439,
      winRate: 0.045,
      profit: 170894.3,
      followers: 1100,
      walletAddress: "0x5095a40...679a9659",
      trades: 119,
    },
    {
      userId: "8",
      rank: 8,
      displayName: "Cooker",
      handle: "cooker_3",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cooker",
      pnl: 880.439,
      winRate: 0.044,
      profit: 170894.3,
      followers: 1100,
      walletAddress: "0x5095a40...679a9659",
      trades: 116,
    },
    {
      userId: "9",
      rank: 9,
      displayName: "Euris",
      handle: "euris_0",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Euris",
      pnl: 880.439,
      winRate: 0.043,
      profit: 170894.3,
      followers: 1100,
      walletAddress: "0x5095a40...679a9659",
      trades: 113,
    },
  ])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const topThree = leaderboardData.slice(0, 3)
  const remaining = leaderboardData.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-black font-sans transition-colors duration-200">
      {/* ========== HEADER ========== */}
      <header className="border-b-4 border-black dark:border-purple-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 drop-shadow-[3px_3px_0_rgba(0,0,0,0.3)]">
              FunRobin
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-grow justify-center space-x-6">
            <Link
              href="/"
              className="font-bold text-gray-900 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="font-bold text-purple-600 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/pricing"
              className="font-bold text-gray-900 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <button className="hidden md:block px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all">
              Connect Broker
            </button>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button onClick={toggleMobileMenu} className="md:hidden p-2 text-gray-900 dark:text-purple-400">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-2 border-t-2 border-black dark:border-purple-400 pt-4">
            <Link href="/" className="font-bold text-gray-900 dark:text-purple-400 py-2">
              Dashboard
            </Link>
            <Link href="/leaderboard" className="font-bold text-purple-600 dark:text-purple-300 py-2">
              Leaderboard
            </Link>
            <Link href="/pricing" className="font-bold text-gray-900 dark:text-purple-400 py-2">
              Pricing
            </Link>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold border-3 border-black dark:border-purple-400 text-left">
              Connect Broker
            </button>
          </nav>
        )}
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="container mx-auto p-4 md:p-6">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-purple-400">PNL Leaderboard</h2>

          {/* Time window filters */}
          <div className="flex gap-2">
            {(["all", "daily", "weekly", "monthly"] as TimeWindow[]).map((window) => (
              <button
                key={window}
                onClick={() => setTimeWindow(window)}
                className={`px-4 py-2 font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all ${
                  timeWindow === window
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-purple-400"
                }`}
              >
                {window === "all" ? "All Time" : window.charAt(0).toUpperCase() + window.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 traders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {topThree.map((entry, index) => (
            <TopTraderCard key={entry.userId} entry={entry} highlighted={index === 0} />
          ))}
        </div>

        {/* Remaining traders table */}
        <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800 border-b-3 border-black dark:border-purple-400">
                <tr>
                  <th className="py-4 px-4 text-center text-sm font-bold text-gray-900 dark:text-purple-400">RANK</th>
                  <th className="py-4 px-4 text-left text-sm font-bold text-gray-900 dark:text-purple-400">
                    TRADER NAME
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-gray-900 dark:text-purple-400">PNL</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-gray-900 dark:text-purple-400">
                    WIN RATE
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-gray-900 dark:text-purple-400">PROFIT</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-gray-900 dark:text-purple-400">
                    FOLLOWERS
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-bold text-gray-900 dark:text-purple-400">
                    WALLET ADDRESS
                  </th>
                </tr>
              </thead>
              <tbody>
                {remaining.map((entry) => (
                  <LeaderboardRow key={entry.userId} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="border-t-4 border-black dark:border-purple-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="font-bold text-gray-900 dark:text-purple-400">© 2025 FunRobin | Trade Smart, Win Big 🚀</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Options trading involves risk. Trade responsibly.
          </p>
        </div>
      </footer>
    </div>
  )
}
