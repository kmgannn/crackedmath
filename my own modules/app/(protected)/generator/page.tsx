"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { BrainCircuit, History } from "lucide-react"
import { generateMathProblem } from "@/lib/gemini-api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { addProblem, getUserGeneratedProblems } from "@/lib/firestore-service"
import { Math } from "@/components/Math"
// Remove the KaTeX imports
// import katex from "katex"
// import "katex/dist/katex.min.css"

type Problem = {
  id: string
  question: string
  solution?: string
  topic?: string
  difficulty?: string
  timestamp: Date
}

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Challenge"]
const MATH_TOPICS = ["Algebra", "Geometry", "Calculus", "Trigonometry", "Statistics", "Probability", "Number Theory"]

export default function GeneratorPage() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"solve" | "generate">("generate")
  const [topic, setTopic] = useState("Algebra")
  const [difficulty, setDifficulty] = useState("Easy")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<Problem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        setIsLoadingHistory(true)
        try {
          const problems = await getUserGeneratedProblems(user.uid)
          setHistory(
            problems.map((p) => ({
              id: p.id || Date.now().toString(),
              question: p.question,
              solution: p.solution,
              topic: p.topic,
              difficulty: p.difficulty,
              timestamp: p.createdAt instanceof Date ? p.createdAt : new Date(),
            })),
          )
        } catch (err) {
          console.error("Error loading history:", err)
          setError("Failed to load history.")
        } finally {
          setIsLoadingHistory(false)
        }
      }
    }

    loadHistory()
  }, [user])

  const toggleSolution = (problemId: string) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };
  const handleGenerate = async () => {
    if (!user) {
      setError("You must be logged in to generate problems")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const result = await generateMathProblem(topic, difficulty)

      const questionPart = result.split("SOLUTION:")[0].replace("PROBLEM:", "").trim()
      const solutionPart = result.split("SOLUTION:")[1]?.trim() || ""

      // Save to Firestore
      const problemData = {
        userId: user.uid,
        question: `${topic} (${difficulty}): ${questionPart}`,
        solution: solutionPart,
        topic,
        difficulty,
        type: "generated" as const,
      }

      const problemId = await addProblem(problemData)

      const newProblem: Problem = {
        id: problemId || Date.now().toString(),
        question: `${topic} (${difficulty}): ${questionPart}`,
        solution: solutionPart,
        topic,
        difficulty,
        timestamp: new Date(),
      }

      setHistory((prev) => [newProblem, ...prev])
    } catch (err) {
      setError("Failed to generate a problem. Please try again.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSolveClick = () => {
    setActiveTab("solve")
    router.push("/solver")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <div className={`tab-container ${isDarkMode ? "tab-container-dark" : "tab-container-light"}`}>
        <button
          onClick={handleSolveClick}
          className={`tab-button ${
            activeTab === "solve"
              ? isDarkMode
                ? "tab-button-active-dark"
                : "tab-button-active-light"
              : isDarkMode
                ? "tab-button-inactive-dark"
                : "tab-button-inactive-light"
          }`}
        >
          <BrainCircuit className="h-5 w-5" />
          Solve Problem
        </button>
        <button
          onClick={() => setActiveTab("generate")}
          className={`tab-button ${
            activeTab === "generate"
              ? isDarkMode
                ? "tab-button-active-dark"
                : "tab-button-active-light"
              : isDarkMode
                ? "tab-button-inactive-dark"
                : "tab-button-inactive-light"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
          Generate Problem
        </button>
      </div>

      <div className={`content-container ${isDarkMode ? "content-container-dark" : "content-container-light"}`}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger id="topic" className={`${isDarkMode ? "input-field-dark" : "input-field-light"}`}>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {MATH_TOPICS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty" className={`${isDarkMode ? "input-field-dark" : "input-field-light"}`}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleGenerate}
            disabled={isProcessing}
            className={`submit-button ${isDarkMode ? "submit-button-dark" : "submit-button-light"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            {isProcessing ? "Generating..." : "Generate Problem"}
          </button>
        </div>
      </div>

      {isLoadingHistory ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : history.length > 0 ? (
        <div className={`content-container ${isDarkMode ? "content-container-dark" : "content-container-light"}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            History
          </h2>
          <div className="space-y-4">
            {history.map((problem) => (
              <div
                key={problem.id}
                className={`history-item ${isDarkMode ? "history-item-dark" : "history-item-light"}`}
              >
                <h3 className="font-semibold mb-1">Problem:</h3>
                <Math>{problem.question}</Math>
                {problem.solution && (
                  <>
                    <div className="mt-4 mb-1">
                      <button
                        onClick={() => toggleSolution(problem.id)}
                        className={`flex items-center justify-between w-full font-semibold text-left ${
                          isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-700 hover:text-indigo-600"
                        }`}
                        aria-expanded={expandedSolutions[problem.id]}
                        aria-controls={`solution-${problem.id}`}
                      >
                        <span>Solution:</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-200 ${
                            expandedSolutions[problem.id] ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>
                    <div
                      id={`solution-${problem.id}`}
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedSolutions[problem.id] 
                          ? "max-h-[2000px] opacity-100" 
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <Math>{problem.solution}</Math>
                    </div>
                  </>
                )}
                <p className="text-sm mt-2 text-muted-foreground">{problem.timestamp.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
