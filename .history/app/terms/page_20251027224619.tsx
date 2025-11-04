"use client"

import { useState } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"

export default function TermsPage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <header className="border-b-4 border-black dark:border-purple-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">fun</h1>
            <div className="w-12 h-12 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center p-2">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full text-purple-600 dark:text-purple-400"
              >
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
            </div>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-purple-400 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#a855f7]"
          >
            {darkMode ? <Sun className="w-5 h-5 text-blue-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="p-8 bg-white dark:bg-gray-900 border-4 border-black dark:border-purple-400 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#a855f7]">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-purple-400">Terms of Service</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last updated: October 25, 2025</p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-purple-400">1. Acceptance of Terms</h2>
              <p>
                By accessing and using FunRobin, you accept and agree to be bound by these Terms of Service. If you do
                not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-purple-400">2. Service Description</h2>
              <p className="mb-2">
                FunRobin is a platform that provides options trading information and tools. Important disclaimers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>FunRobin is not a broker-dealer or financial advisor</li>
                <li>All trades are executed manually by the user on their Robinhood account</li>
                <li>Our service is for educational and entertainment use only</li>
                <li>We do not provide investment advice or recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-purple-400">3. User Responsibilities</h2>
              <p>You are solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All trading decisions and their outcomes</li>
                <li>Maintaining the security of your account credentials</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Understanding the risks associated with options trading</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-purple-400">
                4. Subscription and Billing
              </h2>
              <p className="mb-2">
                Premium subscriptions are billed monthly at $35/month. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Automatic monthly billing until cancellation</li>
                <li>Our refund policy: No refunds for partial months</li>
                <li>Cancellation at any time from your account settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-purple-400">5. Risk Disclosure</h2>
              <p className="font-bold text-red-600 dark:text-red-400 mb-2">
                Options trading involves substantial risk and is not suitable for all investors.
              </p>
              <p>
                You may lose all or more than your initial investment. Past performance does not guarantee future
                results. FunRobin provides tools and information but does not guarantee profits or prevent losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-purple-400">6. Limitation of Liability</h2>
              <p>
                FunRobin and its affiliates shall not be liable for any direct, indirect, incidental, special, or
                consequential damages resulting from your use of our service or any trading decisions made based on
                information provided through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-purple-400">7. Contact</h2>
              <p>
                For questions about these Terms of Service, please contact us at:{" "}
                <a href="mailto:support@funrobin.com" className="text-purple-600 dark:text-purple-400 font-bold">
                  support@funrobin.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
