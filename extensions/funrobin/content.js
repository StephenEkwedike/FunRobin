// Helper: find & fill text inputs (RH DOM can change; keep selectors resilient)
function setInput(sel, val) {
  const el = document.querySelector(sel)
  if (!el) return false
  el.focus()
  el.value = ""
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.value = String(val)
  el.dispatchEvent(new Event("input", { bubbles: true }))
  return true
}

async function fetchPayloadIfPresent() {
  // We encode a one-time code like: https://robinhood.com/options?...?fr=ABC123 or #fr=ABC123
  const url = new URL(window.location.href)
  const code = url.searchParams.get("fr") || (url.hash || "").replace(/^#?fr=/, "")
  if (!code) return null

  const endpoints = [
    "https://funrobin.com/api/autofill/get",
    "http://localhost:3000/api/autofill/get", // dev
  ]

  for (const base of endpoints) {
    try {
      const r = await fetch(`${base}?code=${encodeURIComponent(code)}`, { credentials: "omit" })
      if (r.ok) return await r.json()
    } catch (_) {}
  }
  return null
}

async function tryAutofill() {
  const payload = await fetchPayloadIfPresent()
  if (!payload) return

  // Expected payload example:
  // { symbol:"TSLA", type:"put", strike:435, exp:"2025-10-31", qty:1, priceType:"limit", limit:12.25 }
  // Navigate and selectors: user must already be on the contract/order page.
  // Fill quantity:
  setInput('input[aria-label="Quantity"]', payload.qty ?? 1)

  // Optional: fill limit/market price field if present:
  if (payload.priceType === "limit" && payload.limit != null) {
    setInput('input[aria-label*="Limit Price"]', payload.limit)
  }

  // DO NOT submit. The user reviews & taps Submit.
  console.log("[FunRobin] Autofill complete", payload)
}

// Run shortly after page ready (and again on SPA route changes if needed)
document.addEventListener("DOMContentLoaded", tryAutofill)
setTimeout(tryAutofill, 1200)
