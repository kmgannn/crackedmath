"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { Calculator } from "lucide-react"
import { motion } from "framer-motion"
import NavBar from "@/components/NavBar"
import ThemeToggle from "@/components/ThemeToggle"

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const router = useRouter()

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <div
        className={`app-container flex items-center justify-center px-4 ${isDarkMode ? "dark app-container-dark" : "app-container-light"}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`app-container ${isDarkMode ? "dark app-container-dark" : "app-container-light"}`}>
      {/* Header */}
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center px-4 py-16"
      >
        <h1 className={`app-title text-4xl font-bold mb-4 ${isDarkMode ? "app-title-dark" : "app-title-light"}`}>
          <Calculator className="inline h-10 w-10 mr-2" />
          Cracked Math
        </h1>
        <p className="text-lg mb-6 max-w-md">
          {user ? `Welcome back, ${user.email}!` : "Solve H2 math problems with AI-powered precision."}
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() => router.push("/solver")}
            className={`submit-button px-8 ${isDarkMode ? "submit-button-dark" : "submit-button-light"}`}
            aria-label="Go to solver"
          >
            Crack It
          </button>
        </motion.div>
      </motion.section>

      {/* Features Section (Scrollytelling) */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-12 pb-24" // Added padding at bottom for nav bar
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Cracked Math?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className={`p-6 rounded-lg ${isDarkMode ? "history-item-dark" : "history-item-light"}`}>
            <h3 className="text-xl font-medium mb-2">Solve</h3>
            <p>Crack any math problem with step-by-step solutions in seconds.</p>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? "history-item-dark" : "history-item-light"}`}>
            <h3 className="text-xl font-medium mb-2">Generate</h3>
            <p>Create custom practice problems to master any math concept.</p>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? "history-item-dark" : "history-item-light"}`}>
            <h3 className="text-xl font-medium mb-2">History</h3>
            <p>Track your progress with a complete record of solved problems.</p>
          </div>
        </div>
      </motion.section>

      {/* Bottom Navigation */}
      <NavBar />
    </div>
  )
}
