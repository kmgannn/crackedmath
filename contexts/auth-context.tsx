"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth"
import { auth } from "@/lib/firebase"

type User = {
  uid: string
  email: string | null
  name: string
  displayName: string | null
  photoURL: string | null
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signup: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<{ success: boolean; error: any }>
  signInWithFacebook: () => Promise<{ success: boolean; error: any }>
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
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Error logging in:", error)
      const errorCode = error.code || "unknown-error"
      let errorMessage = "An error occurred during login."

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

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Error signing up:", error)
      const errorCode = error.code || "unknown-error"
      let errorMessage = "An error occurred during signup."

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

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return { success: false, error };
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle: handleGoogleSignIn,
        signInWithFacebook: handleFacebookSignIn,
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
