"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useSession, signIn } from "next-auth/react"

import { cn } from "@/lib/utils"

type ProCtaButtonProps = {
  className?: string
  children?: ReactNode
  callbackUrl?: string
}

export function ProCtaButton({ className, children, callbackUrl = "/pricing" }: ProCtaButtonProps) {
  const { status } = useSession()
  const [loading, setLoading] = useState(false)
  const statusRef = useRef(status)
  const loadingRef = useRef(loading)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  const startCheckout = async () => {
    if (loadingRef.current) return

    if (statusRef.current === "loading") {
      setTimeout(() => {
        void startCheckout()
      }, 150)
      return
    }

    if (statusRef.current !== "authenticated") {
      await signIn(undefined, { callbackUrl })
      return
    }

    setLoading(true)
    loadingRef.current = true
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = (data && (data.error as string)) || "Please sign in to continue."
        alert(message)
        if (res.status === 401) {
          await signIn(undefined, { callbackUrl })
        }
        return
      }

      const data = await res.json().catch(() => ({}))
      const url = data?.url as string | undefined
      if (url) {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer")
        if (!newWindow) {
          window.location.href = url
        }
      } else {
        alert("Unable to start checkout. Please try again.")
      }
    } catch (error) {
      console.error("[ProCtaButton] checkout error", error)
      alert("Unable to start checkout. Please try again.")
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className={cn(
        "px-4 py-2 bg-purple-600 text-white font-bold border-3 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all disabled:opacity-70 disabled:cursor-not-allowed",
        className,
      )}
    >
      {loading ? "Loading..." : children ?? "Start 7-day trial"}
    </button>
  )
}
