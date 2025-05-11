"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"
import { Math } from "@/components/Math"

export default function CheatSheet() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const router = useRouter()
  const formulas = [
    {
      category: "Algebra",
      items: [
        { name: "Quadratic Formula", latex: "\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)" },
        { name: "Binomial Theorem", latex: "\\((a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k\\)" },
        { name: "Sum of Arithmetic Series", latex: "\\(S_n = \\frac{n}{2} [2a + (n-1)d]\\)" },
        { name: "Sum of Geometric Series", latex: "\\(S_n = a \\frac{1 - r^n}{1 - r}, \\quad r \\neq 1\\)" },
        { name: "Difference of Squares", latex: "\\(a^2 - b^2 = (a - b)(a + b)\\)" },
      ],
    },
    {
      category: "Calculus",
      items: [
        { name: "Integration by Parts", latex: "\\(\\int u \\, dv = uv - \\int v \\, du\\)" },
        { name: "Fundamental Theorem", latex: "\\(\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)\\)" },
        { name: "Chain Rule", latex: "\\(\\frac{d}{dx} [f(g(x))] = f'(g(x)) \\cdot g'(x)\\)" },
        { name: "Product Rule", latex: "\\(\\frac{d}{dx} [u \\cdot v] = u'v + uv'\\)" },
        { name: "Quotient Rule", latex: "\\(\\frac{d}{dx} \\left[ \\frac{u}{v} \\right] = \\frac{u'v - uv'}{v^2}\\)" },
        { name: "Definite Integral Property", latex: "\\(\\int_{a}^{b} f(x) \\, dx = -\\int_{b}^{a} f(x) \\, dx\\)" },
      ],
    },
    {
      category: "Trigonometry",
      items: [
        { name: "Sine Rule", latex: "\\(\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}\\)" },
        { name: "Cosine Rule", latex: "\\(c^2 = a^2 + b^2 - 2ab \\cos C\\)" },
        { name: "Double Angle Formula (Sine)", latex: "\\(\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta\\)" },
        { name: "Double Angle Formula (Cosine)", latex: "\\(\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta\\)" },
        { name: "Pythagorean Identity", latex: "\\(\\sin^2 \\theta + \\cos^2 \\theta = 1\\)" },
      ],
    },
    {
      category: "Vectors",
      items: [
        { name: "Magnitude of a Vector", latex: "\\(|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}\\)" },
        { name: "Dot Product", latex: "\\(\\vec{a} \\cdot \\vec{b} = |\\vec{a}| |\\vec{b}| \\cos \\theta\\)" },
        { name: "Cross Product Magnitude", latex: "\\(|\\vec{a} \\times \\vec{b}| = |\\vec{a}| |\\vec{b}| \\sin \\theta\\)" },
        { name: "Vector Addition", latex: "\\(\\vec{a} + \\vec{b} = (a_x + b_x, a_y + b_y, a_z + b_z)\\)" },
      ],
    },
    {
      category: "Complex Numbers",
      items: [
        { name: "Polar Form", latex: "\\(z = r (\\cos \\theta + i \\sin \\theta)\\)" },
        { name: "De Moivre's Theorem", latex: "\\([r (\\cos \\theta + i \\sin \\theta)]^n = r^n (\\cos n\\theta + i \\sin n\\theta)\\)" },
        { name: "Conjugate", latex: "\\(\\bar{z} = a - bi, \\quad z = a + bi\\)" },
        { name: "Modulus", latex: "\\(|z| = \\sqrt{a^2 + b^2}\\)" },
      ],
    },
    {
      category: "Statistics",
      items: [
        { name: "Mean", latex: "\\(\\mu = \\frac{1}{n} \\sum_{i=1}^{n} x_i\\)" },
        { name: "Variance", latex: "\\(\\sigma^2 = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\mu)^2\\)" },
        { name: "Standard Deviation", latex: "\\(\\sigma = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\mu)^2}\\)" },
        { name: "Binomial Probability", latex: "\\(P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}\\)" },
      ],
    },
    {
      category: "Probability",
      items: [
        { name: "Conditional Probability", latex: "\\(P(A|B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) \\neq 0\\)" },
        { name: "Bayes' Theorem", latex: "\\(P(A|B) = \\frac{P(B|A) P(A)}{P(B)}\\)" },
        { name: "Total Probability", latex: "\\(P(A) = \\sum P(A|B_i) P(B_i)\\)" },
      ],
    },    
  ]
  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <div className={`app-container flex items-center justify-center px-4 ${isDarkMode ? "dark app-container-dark" : "app-container-light"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`content-container ${isDarkMode ? "content-container-dark" : "content-container-light"}`}>
    
      {/* Main Content */}
      <main className="pb-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
         <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            H2 Math Cheat Sheet
          </h1>
            {formulas.map((category, index) => (
              <div key={index} className="space-y-4">
                <h2>
                  {category.category}
                </h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  {category.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border`}>
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <Math>{item.latex}</Math>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          
        </motion.section>
      </main>

    </div>
  )
}
