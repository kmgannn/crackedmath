"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Calculator, User, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useSwipeable } from "react-swipeable"
import { useTheme } from "@/contexts/theme-context"

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isDarkMode } = useTheme()

  const navItems = [
    { name: "Home", path: "/home", icon: <Home className="h-6 w-6" /> },
    { name: "Solver", path: "/solver", icon: <Calculator className="h-6 w-6" /> },
    { name: "Generator", path: "/generator", icon: <Sparkles className="h-6 w-6" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-6 w-6" /> },
  ]

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = navItems.findIndex((item) => item.path === pathname)
      if (currentIndex < navItems.length - 1) {
        router.push(navItems[currentIndex + 1].path)
      }
    },
    onSwipedRight: () => {
      const currentIndex = navItems.findIndex((item) => item.path === pathname)
      if (currentIndex > 0) {
        router.push(navItems[currentIndex - 1].path)
      }
    },
  })

  return (
    <motion.nav
      {...handlers}
      className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"} border-t border-border flex justify-around py-2 z-50`}
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {navItems.map((item) => (
        <motion.button
          key={item.name}
          onClick={() => router.push(item.path)}
          className={`flex flex-col items-center p-2 ${
            pathname === item.path || (item.path === "/home" && pathname === "/")
              ? isDarkMode
                ? "text-indigo-400"
                : "text-indigo-600"
              : isDarkMode
                ? "text-gray-400"
                : "text-gray-500"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, rotate: -3 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
          aria-label={`Go to ${item.name}`}
        >
          <motion.div animate={pathname === item.path ? { y: [0, -3, 0] } : {}} transition={{ duration: 0.3 }}>
            {item.icon}
          </motion.div>
          <span className="text-xs mt-1">{item.name}</span>
        </motion.button>
      ))}
    </motion.nav>
  )
}
