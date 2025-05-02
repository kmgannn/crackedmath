"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

type User = {
  uid: string
  email: string | null
  name: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signup: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true)
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.email?.split("@")[0] || "User",
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Update the login function to better handle Firebase errors
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Error logging in:", error)

      // Extract the Firebase error code
      const errorCode = error.code || "unknown-error"
      let errorMessage = "An error occurred during login."

      // Map Firebase error codes to user-friendly messages
      if (
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password. Please check your credentials and try again."
      } else if (errorCode === "auth/user-disabled") {
        errorMessage = "This account has been disabled. Please contact support."
      } else if (errorCode === "auth/too-many-requests") {
        errorMessage = "Too many unsuccessful login attempts. Please try again later."
      } else if (errorCode === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection and try again."
      }

      return { success: false, error: errorMessage }
    }
  }

  // Update the signup function to match the new return format
  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Error signing up:", error)

      // Extract the Firebase error code
      const errorCode = error.code || "unknown-error"
      let errorMessage = "An error occurred during signup."

      // Map Firebase error codes to user-friendly messages
      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please try a different email or login instead."
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please enter a valid email."
      } else if (errorCode === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password."
      } else if (errorCode === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection and try again."
      }

      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
