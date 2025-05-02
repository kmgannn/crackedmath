"use client"

import { useTheme } from "@/contexts/theme-context"
import NavBar from "@/components/NavBar"
import { motion } from "framer-motion"

export default function AboutPage() {
  const { isDarkMode } = useTheme()

  return (
    <div className={`app-container ${isDarkMode ? "dark app-container-dark" : "app-container-light"}`}>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 max-w-3xl mx-auto pt-16 pb-24"
      >
        <h1 className="text-2xl font-bold mb-6">About Cracked Math</h1>
        <div className={`content-container ${isDarkMode ? "content-container-dark" : "content-container-light"}`}>
          <p className="mb-4">
            Cracked Math is your go-to app for solving H2 math problems with AI-powered precision. Powered by Google
            Gemini and OCR technology, we make math accessible and fun for everyone.
          </p>
          <p className="mb-4">
            Our mission is to empower students and educators with tools to tackle complex problems effortlessly. Whether
            you're struggling with algebra, calculus, or any other math topic, our AI solver can help you understand the
            solution step by step.
          </p>
          <p className="mb-4">
            <strong>Features:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>AI-powered math problem solving</li>
              <li>OCR technology to extract problems from images</li>
              <li>Step-by-step solutions with explanations</li>
              <li>Problem generation for practice</li>
              <li>Dark and light mode for comfortable viewing</li>
            </ul>
          </p>
          <p>
            <strong>Contact:</strong> support@crackedmath.com
          </p>
        </div>
      </motion.section>
      <NavBar />
    </div>
  )
}
