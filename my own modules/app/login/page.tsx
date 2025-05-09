"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { Calculator, Lock, UserPlus, LogIn } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ThemeToggle from "@/components/ThemeToggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup, isLoading: authLoading } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const router = useRouter()

  // Update the handleLogin function to work with the new error handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        // Redirect to home page after successful login
        router.push("/home")
      } else {
        setError(result.error || "Invalid email or password.")
      }
    } catch (err) {
      setError("An error occurred during login.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleSignup function to work with the new error handling
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      setIsLoading(false)
      return
    }

    try {
      const result = await signup(email, password)
      if (result.success) {
        // Redirect to home page after successful signup
        router.push("/home")
      } else {
        setError(result.error || "Failed to create account. Email may already be in use.")
      }
    } catch (err) {
      setError("An error occurred during signup.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
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
    <div
      className={`app-container flex items-center justify-center px-4 ${isDarkMode ? "dark app-container-dark" : "app-container-light"}`}
    >
      <div className={`auth-container ${isDarkMode ? "auth-container-dark" : "auth-container-light"}`}>
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <h1 className={`app-title app-title-auth ${isDarkMode ? "app-title-dark" : "app-title-light"}`}>
          <Calculator className="h-8 w-8" />
          Cracked Math
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`input-field ${isDarkMode ? "input-field-dark" : "input-field-light"}`}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`input-field ${isDarkMode ? "input-field-dark" : "input-field-light"}`}
                  required
                />
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <button
                type="submit"
                className={`submit-button ${isDarkMode ? "submit-button-dark" : "submit-button-light"}`}
                disabled={isLoading}
              >
                <LogIn className="h-5 w-5" />
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`input-field ${isDarkMode ? "input-field-dark" : "input-field-light"}`}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password (min 6 characters)"
                  className={`input-field ${isDarkMode ? "input-field-dark" : "input-field-light"}`}
                  required
                />
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <button
                type="submit"
                className={`submit-button ${isDarkMode ? "submit-button-dark" : "submit-button-light"}`}
                disabled={isLoading}
              >
                <UserPlus className="h-5 w-5" />
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
