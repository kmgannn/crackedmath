"use client"

import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { LogOut } from "lucide-react"
import { motion } from "framer-motion"
import ThemeToggle from "@/components/ThemeToggle"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className={`content-container ${isDarkMode ? "content-container-dark" : "content-container-light"}`}>
        {user ? (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Account Information</h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.name || "Not set"}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Preferences</h2>
              <div className="flex items-center justify-between">
                <p>Theme: {isDarkMode ? "Dark Mode" : "Light Mode"}</p>
                <ThemeToggle />
              </div>
            </div>

            <button
              onClick={logout}
              className={`submit-button ${isDarkMode ? "submit-button-dark" : "submit-button-light"}`}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </button>
          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </motion.div>
  )
}
