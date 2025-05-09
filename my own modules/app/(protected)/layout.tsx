"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import NavBar from "@/components/NavBar"
import { Calculator } from "lucide-react"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { isDarkMode } = useTheme()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={`app-container ${isDarkMode ? "dark app-container-dark" : "app-container-light"}`}>
      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`app-title app-title-main ${isDarkMode ? "app-title-dark" : "app-title-light"}`}>
              <Calculator className="h-8 w-8" />
              Cracked Math
            </h1>
            <div className="flex items-center gap-4">
              {user && <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>}
            </div>
          </div>

          <p className="text-center mb-8 text-muted-foreground">Solve and generate math problems with AI</p>

          {children}
        </div>
      </div>
      <NavBar />
    </div>
  )
}
