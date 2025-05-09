"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
let genAI: GoogleGenerativeAI | null = null
let model: any = null

try {
  const apiKey = process.env.GEMINI_API_KEY || ""
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey)
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  }
} catch (error) {
  console.error("Error initializing Gemini API:", error)
}

export async function solveMathProblem(problem: string): Promise<string> {
  if (!model) {
    throw new Error("AI service is not available. Please try again later.")
  }

  try {
    const prompt = `
      You are a helpful math tutor. Please solve the following math problem step by step:
      
      ${problem}
      
      Provide a clear, detailed explanation of each step in the solution process.
      Format your answer with clear steps and explanations.
      If there are multiple approaches, show the most straightforward one first.
      Format all math expressions in LaTeX, and wrap them in \\( ... \\) for inline math or \\[ ... \\] for block math. 
      Do not use Markdown. Only use plain text and LaTeX delimiters.
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Error solving math problem:", error)

    // Check for specific error types
    if (error instanceof Error) {
      // Handle rate limiting or quota errors
      if (error.message.includes("quota") || error.message.includes("rate")) {
        throw new Error("AI service is currently busy. Please try again in a few moments.")
      }

      // Handle content filtering errors
      if (error.message.includes("content") && error.message.includes("filter")) {
        throw new Error("Unable to process this problem due to content restrictions. Please try a different problem.")
      }

      throw new Error(`Failed to solve the math problem: ${error.message}`)
    }

    throw new Error("An unexpected error occurred while solving the problem. Please try again.")
  }
}

export async function generateMathProblem(topic: string, difficulty: string): Promise<string> {
  if (!model) {
    throw new Error("AI service is not available. Please try again later.")
  }

  try {
    const prompt = `
      Generate a ${difficulty.toLowerCase()} level ${topic.toLowerCase()} math problem.
      
      The problem should be challenging but solvable for a student at the ${difficulty.toLowerCase()} level.
      Include the problem statement and a separate solution with step-by-step explanations.
      Use clear notation: use * for multiplication, / for division, and ^ for exponents.
      For example, write x^2 for x squared, and 2*x for 2 times x.
      Format your response as:
      
      PROBLEM:
      [The problem statement]
      
      SOLUTION:
      [Step-by-step solution with explanations]
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Error generating math problem:", error)

    // Check for specific error types
    if (error instanceof Error) {
      // Handle rate limiting or quota errors
      if (error.message.includes("quota") || error.message.includes("rate")) {
        throw new Error("AI service is currently busy. Please try again in a few moments.")
      }

      throw new Error(`Failed to generate a math problem: ${error.message}`)
    }

    throw new Error("An unexpected error occurred while generating the problem. Please try again.")
  }
}
