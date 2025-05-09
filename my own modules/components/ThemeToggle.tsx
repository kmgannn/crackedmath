"use client"

import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${
        isDarkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-600"
      } transition-colors duration-300 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 0 : 180 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </motion.button>
  )
}
