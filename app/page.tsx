"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Menu, Moon, Sun, X, TrendingUp, TrendingDown, Zap, Filter, Search, Crown, RotateCcw } from "lucide-react"

// ============================================
// TYPES
// ============================================
type StockOption = {
  id: string
  symbol: string
  company: string
  type: "call" | "put"
  strike: number
  currentPrice: number
  expiry: string
  premium: number
  multiplier: number
  volume: number
  isHot: boolean
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

const ConfettiEffect: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null

  const colors = ["#a855f7", "#ec4899", "#f59e0b", "#3b82f6", "#10b981", "#ef4444"]

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-[fall_3s_ease-out_forwards]"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          <div
            className={Math.random() > 0.5 ? "w-3 h-3" : "w-4 h-2"}
            style={{
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN COMPONENTS
// ============================================

const StockOptionTile: React.FC<{
  option: StockOption
  onClick: () => void
  isSelected: boolean
  heartbeatClass?: string
}> = ({ option, onClick, isSelected, heartbeatClass = "" }) => {
  const profitPercent = (((option.strike - option.currentPrice) / option.currentPrice) * 100).toFixed(1)
  const isProfit = Number.parseFloat(profitPercent) > 0

  return (
    <button
      onClick={onClick}
      className={`relative w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br ${
        option.type === "call"
          ? "from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30"
          : "from-pink-50 to-purple-100 dark:from-pink-900/30 dark:to-purple-800/30"
      } border-3 border-black dark:border-purple-400 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#a855f7] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_0_#000] dark:hover:shadow-[3px_3px_0_0_#a855f7] transition-all ${
        isSelected ? "ring-4 ring-purple-500 dark:ring-purple-400" : ""
      } backdrop-blur-sm ${heartbeatClass}`}
    >
      {/* Hot badge */}
      {option.isHot && (
        <div
          className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 border-2 border-black dark:border-purple-400 shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#a855f7] animate-pulse cursor-help"
          title="If option is moving >3% today or high IV"
        >
          🔥 HOT
        </div>
      )}

      {/* Symbol and company */}
      <div className="mb-3 cursor-help" title="Stock name + logo (e.g., TSLA / Tesla Inc.)">
        <h3 className="text-xl font-bold text-gray-900 dark:text-purple-400 mb-1">{option.symbol}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{option.company}</p>
      </div>

      {/* Type badge */}
      <div
        className={`inline-block px-3 py-1 mb-3 text-xs font-bold border-2 border-black dark:border-purple-400 cursor-help ${
          option.type === "call" ? "bg-blue-400 text-black" : "bg-pink-400 text-black"
        }`}
        title="CALL or PUT (button color-coded): Blue = Call / Red = Put"
      >
        {option.type.toUpperCase()}
      </div>

      {/* Price info */}
      <div className="space-y-2 text-left">
        <div className="flex justify-between items-center cursor-help" title="Target strike (e.g., $435)">
          <span className="text-xs text-gray-600 dark:text-gray-300">Strike:</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">${option.strike}</span>
        </div>
        <div className="flex justify-between items-center cursor-help" title="Live stock price (e.g., $433.73)">
          <span className="text-xs text-gray-600 dark:text-gray-300">Current:</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">${option.currentPrice}</span>
        </div>
        <div className="flex justify-between items-center cursor-help" title="Current option price (e.g., $12.25)">
          <span className="text-xs text-gray-600 dark:text-gray-300">Premium:</span>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">${option.premium}</span>
        </div>
      </div>

      {/* Multiplier and profit */}
      <div className="mt-3 pt-3 border-t-2 border-black/10 dark:border-purple-400/20">
        <div
          className="flex justify-between items-center mb-2 cursor-help"
          title="Calculated fun stat based on ITM distance, volatility, and expiry (e.g., 22x)"
        >
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Multiplier:</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">{option.multiplier}x</span>
        </div>
        <div
          className="flex items-center justify-between cursor-help"
          title="Simulated potential gain (based on slider) (e.g., ↑ 3.4%)"
        >
          <span className="text-xs text-gray-600 dark:text-gray-300">Potential:</span>
          <div
            className={`flex items-center gap-1 ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="text-sm font-bold">{profitPercent}%</span>
          </div>
        </div>
      </div>

      {/* Expiry */}
      <div
        className="mt-2 text-xs text-gray-500 dark:text-gray-400 cursor-help"
        title="Option expiry (e.g., Exp: 2025-10-31)"
      >
        Exp: {option.expiry}
      </div>
    </button>
  )
}

const TradeConfirmationModal: React.FC<{
  option: StockOption | null
  onClose: () => void
  onConfirm: () => void
}> = ({ option, onClose, onConfirm }) => {
  if (!option) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-purple-400 shadow-[12px_12px_0_0_#000] dark:shadow-[12px_12px_0_0_#a855f7] max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 drop-shadow-[3px_3px_0_rgba(0,0,0,0.3)]">
            Confirm Trade
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 border-2 border-black dark:border-purple-400">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-gray-900 dark:text-white">{option.symbol}</span>
              <span
                className={`px-2 py-1 text-xs font-bold border-2 border-black dark:border-purple-400 ${
                  option.type === "call" ? "bg-blue-400" : "bg-pink-400"
                } text-black`}
              >
                {option.type.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{option.company}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Strike Price:</span>
                <span className="font-bold text-gray-900 dark:text-white">${option.strike}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Premium:</span>
                <span className="font-bold text-green-600 dark:text-green-400">${option.premium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Multiplier:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{option.multiplier}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Expiry:</span>
                <span className="font-bold text-gray-900 dark:text-white">{option.expiry}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-600 dark:border-green-400">
            <p className="text-sm font-bold text-green-800 dark:text-green-400 mb-1">Potential Return</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${(option.premium * option.multiplier).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-purple-500 text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all flex items-center justify-center gap-2 cursor-help"
            title="Triggers chirp + confetti + opens RH auto-fill"
          >
            <Zap size={20} />
            Execute Trade
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function Home() {
  const { data: session } = useSession()
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<StockOption | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<any>({
    type: "all",
    minMultiplier: 1,
    hotOnly: false,
    daysToExpiry: 30,
    moneyness: 0,
    stake: 100,
  })
  const chirpAudioRef = useRef<HTMLAudioElement | null>(null)
  const plan = (session?.user as any)?.plan ?? "free"
  const isPremium = plan === "pro"

  // Mock stock options data
  const [stockOptions] = useState<StockOption[]>([
    {
      id: "1",
      symbol: "TSLA",
      company: "Tesla Inc.",
      type: "call",
      strike: 250,
      currentPrice: 245,
      expiry: "2025-11-15",
      premium: 12.5,
      multiplier: 10,
      volume: 15420,
      isHot: true,
    },
    {
      id: "2",
      symbol: "AAPL",
      company: "Apple Inc.",
      type: "call",
      strike: 180,
      currentPrice: 175,
      expiry: "2025-11-20",
      premium: 8.75,
      multiplier: 15,
      volume: 28350,
      isHot: true,
    },
    {
      id: "3",
      symbol: "NVDA",
      company: "NVIDIA Corp.",
      type: "call",
      strike: 500,
      currentPrice: 485,
      expiry: "2025-12-01",
      premium: 25.0,
      multiplier: 20,
      volume: 32100,
      isHot: true,
    },
    {
      id: "4",
      symbol: "MSFT",
      company: "Microsoft Corp.",
      type: "put",
      strike: 380,
      currentPrice: 390,
      expiry: "2025-11-18",
      premium: 6.25,
      multiplier: 8,
      volume: 12450,
      isHot: false,
    },
    {
      id: "5",
      symbol: "GOOGL",
      company: "Alphabet Inc.",
      type: "call",
      strike: 140,
      currentPrice: 138,
      expiry: "2025-11-25",
      premium: 5.5,
      multiplier: 12,
      volume: 18920,
      isHot: false,
    },
    {
      id: "6",
      symbol: "AMZN",
      company: "Amazon.com Inc.",
      type: "call",
      strike: 175,
      currentPrice: 170,
      expiry: "2025-12-05",
      premium: 9.0,
      multiplier: 18,
      volume: 24680,
      isHot: true,
    },
    {
      id: "7",
      symbol: "META",
      company: "Meta Platforms",
      type: "put",
      strike: 480,
      currentPrice: 495,
      expiry: "2025-11-22",
      premium: 11.25,
      multiplier: 14,
      volume: 19340,
      isHot: false,
    },
    {
      id: "8",
      symbol: "AMD",
      company: "Advanced Micro Devices",
      type: "call",
      strike: 165,
      currentPrice: 160,
      expiry: "2025-11-28",
      premium: 7.8,
      multiplier: 16,
      volume: 21560,
      isHot: true,
    },
    {
      id: "9",
      symbol: "NFLX",
      company: "Netflix Inc.",
      type: "call",
      strike: 620,
      currentPrice: 610,
      expiry: "2025-12-10",
      premium: 18.5,
      multiplier: 22,
      volume: 14230,
      isHot: false,
    },
    {
      id: "10",
      symbol: "DIS",
      company: "Walt Disney Co.",
      type: "put",
      strike: 95,
      currentPrice: 98,
      expiry: "2025-11-30",
      premium: 4.75,
      multiplier: 9,
      volume: 16780,
      isHot: false,
    },
    {
      id: "11",
      symbol: "CSCO",
      company: "Cisco Systems",
      type: "call",
      strike: 55,
      currentPrice: 53,
      expiry: "2025-12-08",
      premium: 3.25,
      multiplier: 11,
      volume: 13450,
      isHot: false,
    },
    {
      id: "12",
      symbol: "INTC",
      company: "Intel Corp.",
      type: "call",
      strike: 48,
      currentPrice: 46,
      expiry: "2025-11-27",
      premium: 2.9,
      multiplier: 13,
      volume: 17890,
      isHot: true,
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

  const handleTileClick = (option: StockOption) => {
    setSelectedOption(option)
  }

  const playCelebrationSound = () => {
    if (!chirpAudioRef.current) {
      chirpAudioRef.current = new Audio("/513712__luke100000__single-bird-chirp-1.wav")
      chirpAudioRef.current.volume = 0.65
    }

    const audio = chirpAudioRef.current
    if (!audio) return

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const openRobinhoodWithAutofill = async (option: StockOption) => {
    try {
      // Create one-time autofill code
      const response = await fetch("/api/autofill/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: option.symbol,
          type: option.type,
          strike: option.strike,
          exp: option.expiry,
          qty: 1,
          priceType: "limit",
          limit: option.premium,
        }),
      })
      const data = await response.json().catch(() => ({}))
      const code = data?.code as string | undefined

      if (!response.ok || !code) {
        const errorMessage = (data && (data.error as string)) || "Unable to create autofill."
        if (response.status === 401) {
          window.location.href = "/signin"
          return
        }
        if (response.status === 402) {
          alert("FunRobin Pro is required for one-click autofill.")
          return
        }
        console.error("[v0] Failed to create autofill:", errorMessage)
        return
      }

      // Open Robinhood with autofill code (Chrome extension will handle the rest)
      window.open(`https://robinhood.com/?fr=${code}`, "_blank")?.focus()
    } catch (error) {
      console.error("[v0] Failed to create autofill:", error)
    }
  }

  const handleConfirmTrade = () => {
    if (!isPremium) {
      window.alert("FunRobin Pro is required to auto-fill Robinhood trades and unlock 20x multipliers.")
      setSelectedOption(null)
      return
    }

    playCelebrationSound()

    if (selectedOption) {
      openRobinhoodWithAutofill(selectedOption)
    }
    setShowConfetti(true)
    setSelectedOption(null)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const resetFilters = () => {
    setFilters({
      type: "all",
      minMultiplier: 1,
      hotOnly: false,
      daysToExpiry: 30,
      moneyness: 0,
      stake: 100,
    })
  }

  // Filter options based on search and filters
  const filteredOptions = stockOptions.filter((option) => {
    const matchesSearch =
      option.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filters.type === "all" || option.type === filters.type
    const matchesMultiplier = option.multiplier >= filters.minMultiplier
    const matchesHot = !filters.hotOnly || option.isHot
    const expiryDate = new Date(option.expiry)
    const daysToExpiry = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
    const matchesDaysToExpiry = daysToExpiry >= filters.daysToExpiry
    const moneyness = ((option.currentPrice - option.strike) / option.strike) * 100
    const matchesMoneyness = moneyness >= filters.moneyness && moneyness <= filters.moneyness + 20

    return matchesSearch && matchesType && matchesMultiplier && matchesHot && matchesDaysToExpiry && matchesMoneyness
  })

  const sortedOptions = [...filteredOptions].sort((a, b) => b.multiplier - a.multiplier)
  const top10PercentCount = Math.ceil(sortedOptions.length * 0.1)
  const top25PercentCount = Math.ceil(sortedOptions.length * 0.25)

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-black font-sans transition-colors duration-200`}
    >
      <ConfettiEffect show={showConfetti} />

      {/* ========== HEADER ========== */}
      <header className="border-b-4 border-black dark:border-purple-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
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
              className="font-bold text-gray-900 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
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
            <Link href="/leaderboard" className="font-bold text-gray-900 dark:text-purple-400 py-2">
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
        {/* Upgrade Banner for Free Users */}
        {!isPremium && (
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-300" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Unlock Premium Features</h3>
                  <p className="text-white/90 text-sm">
                    Get live auto-fill, up to 20x multipliers, and leaderboard access
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white text-purple-600 font-bold border-3 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all whitespace-nowrap"
              >
                Subscribe for $35/mo
              </Link>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="mb-8 p-6 md:p-8 bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7] backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-purple-400">
                Trade for Fun 🎮
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                One-click options trading. Gamified. Simple. Profitable.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-purple-900/30 p-4 border-3 border-black dark:border-purple-400">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Traders</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">12,847</p>
              </div>
              <div className="w-px h-12 bg-black dark:bg-purple-400" />
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">Today's Volume</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$2.4M</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search stocks (e.g., TSLA, AAPL, NVDA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] text-gray-900 dark:text-white font-bold placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Filter Panel */}
        <div className="mb-6">
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
            >
              <Filter size={20} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={() => {
                setFilters({
                  type: "all",
                  minMultiplier: 1,
                  hotOnly: false,
                  daysToExpiry: 1,
                  moneyness: -20,
                  stake: 10,
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
            >
              See All
            </button>
            {showFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-bold border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_#a855f7] transition-all"
              >
                <RotateCcw size={20} />
                Reset Filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="p-6 bg-white dark:bg-gray-800 border-3 border-black dark:border-purple-400 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#a855f7]">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-purple-400 flex items-center gap-2">
                <Filter size={20} />
                Filters & Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-purple-400">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black dark:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
                  >
                    <option value="all">See All</option>
                    <option value="call">Calls Only</option>
                    <option value="put">Puts Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-purple-400">
                    Min Multiplier: {filters.minMultiplier}x
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={isPremium ? "20" : "10"}
                    value={filters.minMultiplier}
                    onChange={(e) => setFilters({ ...filters, minMultiplier: Number.parseInt(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                  {!isPremium && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Premium: Up to 20x multipliers</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-purple-400">
                    Time to Expiry: {filters.daysToExpiry} days
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={filters.daysToExpiry}
                    onChange={(e) => setFilters({ ...filters, daysToExpiry: Number.parseInt(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-purple-400">
                    ITM/OTM Range: {filters.moneyness}%
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={filters.moneyness}
                    onChange={(e) => setFilters({ ...filters, moneyness: Number.parseInt(e.target.value) })}
                    className="w-full accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>OTM</span>
                    <span>ATM</span>
                    <span>ITM</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-purple-400">
                    Stake: ${filters.stake}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={filters.stake}
                    onChange={(e) => setFilters({ ...filters, stake: Number.parseInt(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hotOnly}
                      onChange={(e) => setFilters({ ...filters, hotOnly: e.target.checked })}
                      className="w-5 h-5 accent-orange-500"
                      disabled={!isPremium}
                    />
                    <span className="text-sm font-bold text-gray-900 dark:text-purple-400">
                      🔥 Hot Options Only {!isPremium && "(Premium)"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-purple-400">Live Options Grid</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300">Showing {filteredOptions.length} options</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedOptions.map((option, index) => {
              let heartbeatClass = ""
              if (index < top10PercentCount) {
                heartbeatClass = "heartbeat-vibrate"
              } else if (index < top25PercentCount) {
                heartbeatClass = "heartbeat"
              }

              const isHotLocked = option.isHot && !isPremium
              const isHighMultiplierLocked = option.multiplier > 10 && !isPremium

              return (
                <div key={option.id} className="relative min-h-[320px]">
                  {(isHotLocked || isHighMultiplierLocked) && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center border-3 border-purple-500">
                      <div className="text-center p-4">
                        <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                        <p className="text-white font-bold mb-2">Premium Only</p>
                        <Link
                          href="/pricing"
                          className="px-4 py-2 bg-purple-500 text-white text-sm font-bold border-2 border-black shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all inline-block"
                        >
                          Upgrade Now
                        </Link>
                      </div>
                    </div>
                  )}
                  <StockOptionTile
                    option={option}
                    onClick={() => !isHotLocked && !isHighMultiplierLocked && handleTileClick(option)}
                    isSelected={selectedOption?.id === option.id}
                    heartbeatClass={heartbeatClass}
                  />
                </div>
              )
            })}
          </div>

          {filteredOptions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-900 border-3 border-black dark:border-purple-400 shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#a855f7]">
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">No options match your filters</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </section>
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

      {/* Trade Confirmation Modal */}
      <TradeConfirmationModal
        option={selectedOption}
        onClose={() => setSelectedOption(null)}
        onConfirm={handleConfirmTrade}
      />
    </div>
  )
}
