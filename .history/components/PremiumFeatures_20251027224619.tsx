/**
 * ============================================
 * PREMIUM FEATURES UI COMPONENTS REFERENCE
 * ============================================
 *
 * This file documents all UI patterns used to differentiate
 * free vs premium features in FunRobin.
 *
 * Premium Plan: $35/month
 * - Live option updates
 * - Robinhood Auto-Fill
 * - Multipliers up to 20x (free: up to 10x)
 * - Leaderboard Eligibility
 * - Access to "HOT" grids
 */

"use client"

import Link from "next/link"
import { Crown } from "lucide-react"

// ============================================
// 1. UPGRADE BANNER (Dashboard - Free Users Only)
// ============================================
/**
 * Shows at the top of the dashboard for free users
 * Promotes premium features and links to pricing page
 */
export const UpgradeBanner = () => {
  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-300" />
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Unlock Premium Features</h3>
            <p className="text-white/90 text-sm">Get live auto-fill, up to 20x multipliers, and leaderboard access</p>
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
  )
}

// ============================================
// 2. PREMIUM LOCK OVERLAY (Option Grid Cards)
// ============================================
/**
 * Blurs and locks premium-only options (HOT grids, 20x+ multipliers)
 * Shows upgrade prompt with crown icon
 * Applied to individual option cards in the grid
 */
export const PremiumLockOverlay = () => {
  return (
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
  )
}

// ============================================
// 3. FILTER RESTRICTIONS (Min Multiplier Slider)
// ============================================
/**
 * Limits multiplier slider to 10x for free users
 * Shows "Premium: Up to 20x multipliers" hint text
 * Premium users can slide up to 20x
 */
export const MultiplierFilterWithRestriction = ({ isPremium, filters, setFilters }: any) => {
  return (
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
      {!isPremium && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Premium: Up to 20x multipliers</p>}
    </div>
  )
}

// ============================================
// 4. HOT OPTIONS FILTER CHECKBOX
// ============================================
/**
 * Disables "Hot Options Only" checkbox for free users
 * Shows "(Premium)" label next to the checkbox
 * Premium users can filter to show only hot options
 */
export const HotOptionsFilterWithRestriction = ({ isPremium, filters, setFilters }: any) => {
  return (
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
  )
}

// ============================================
// 5. PREMIUM GATING LOGIC (Option Grid)
// ============================================
/**
 * Determines which options should be locked for free users:
 * - isHotLocked: HOT options are premium-only
 * - isHighMultiplierLocked: Options with 20x+ multipliers are premium-only
 *
 * Usage in grid rendering:
 */
export const getPremiumLockStatus = (option: any, isPremium: boolean) => {
  const isHotLocked = option.isHot && !isPremium
  const isHighMultiplierLocked = option.multiplier > 10 && !isPremium

  return {
    isLocked: isHotLocked || isHighMultiplierLocked,
    isHotLocked,
    isHighMultiplierLocked,
  }
}

// ============================================
// 6. EXAMPLE USAGE IN GRID
// ============================================
/**
 * How to apply premium gating to option cards:
 *
 * {sortedOptions.map((option, index) => {
 *   const { isLocked, isHotLocked, isHighMultiplierLocked } = getPremiumLockStatus(option, isPremium)
 *
 *   return (
 *     <div key={option.id} className="relative">
 *       {isLocked && <PremiumLockOverlay />}
 *       <StockOptionTile
 *         option={option}
 *         onClick={() => !isLocked && handleTileClick(option)}
 *         isSelected={selectedOption?.id === option.id}
 *       />
 *     </div>
 *   )
 * })}
 */

// ============================================
// 7. SUBSCRIPTION STATUS CHECK
// ============================================
/**
 * In production, check user's subscription status via:
 * - NextAuth session with Stripe customer ID
 * - Backend API call to verify active subscription
 * - Store in state: const [isPremium, setIsPremium] = useState(false)
 *
 * Example:
 * useEffect(() => {
 *   fetch('/api/user/subscription')
 *     .then(res => res.json())
 *     .then(data => setIsPremium(data.isPremium))
 * }, [])
 */

// ============================================
// 8. FEATURE COMPARISON TABLE
// ============================================
/**
 * Free vs Premium Features:
 *
 * Feature                  | Free | Premium ($35/mo)
 * -------------------------|------|------------------      |     | 
 * Robinhood Auto-Fill      | ✗    | ✅
 * Multipliers up to 20x    | ✗    | ✅ (Free: up to 10x)
 * Leaderboard Eligibility  | ✗    | ✅
 * Access to "HOT" grids    | ✗    | ✅
 * Bird Chirp + Confetti    | ✅    | ✅
 */

export default function PremiumFeaturesReference() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-purple-600">Premium Features UI Reference</h1>
      <p className="text-lg mb-8 text-gray-700">
        This file documents all UI patterns used to differentiate free vs premium features in FunRobin.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-purple-600">1. Upgrade Banner</h2>
          <UpgradeBanner />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-purple-600">2. Premium Lock Overlay</h2>
          <div className="relative h-64 bg-gray-100 border-3 border-black">
            <PremiumLockOverlay />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-purple-600">3. Filter Restrictions</h2>
          <p className="text-gray-700 mb-4">
            Free users see limited multiplier ranges and disabled HOT filter checkbox.
          </p>
        </section>
      </div>
    </div>
  )
}
