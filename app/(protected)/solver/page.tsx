"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/theme-context";
import { solveMathProblem } from "@/lib/gemini-api";

import {
  BrainCircuit,
  Upload,
  History,
  FileText,
  Type,
  X,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuestionCounter } from "@/components/QuestionCounter";
import { Math } from "@/components/Math";

type Problem = {
  id: string;
  question: string;
  solution?: string;
  timestamp: Date;
};

export default function SolverPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState<"solve" | "generate">("solve");
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
  const [problem, setProblem] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [history, setHistory] = useState<Problem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSolve = async () => {
    setError("");
    setExtractedText("");

    if (inputMethod === "text" && !problem.trim()) {
      setError("Please enter a math problem");
      return;
    }

    if (inputMethod === "file" && !file) {
      setError("Please upload an image or PDF file");
      return;
    }

    if (inputMethod === "file" && file && file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setIsProcessing(true);

    try {
      let result: string;
      let extractedProblem: string = problem;

      if (inputMethod === "file" && file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/ocr-solve", {
          method: "POST",
          body: formData,
        });

        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const data = await response.json();

          if (!response.ok) {
            if (data.extractedText) {
              setExtractedText(data.extractedText);
              setProblem(data.extractedText);
              setInputMethod("text");
              throw new Error(
                `${data.error} We've added the extracted text to the input field for you to try again.`
              );
            }
            throw new Error(data.error || `Server error: ${response.status}`);
          }

          result = data.solution;
          extractedProblem = data.problem;
        } else {
          const errorText = await response.text();
          throw new Error(
            `Unexpected response from server: ${errorText.substring(0, 100)}...`
          );
        }
      } else {
        result = await solveMathProblem(problem);
      }

      const newProblem: Problem = {
        id: Date.now().toString(),
        question: extractedProblem,
        solution: result,
        timestamp: new Date(),
      };

      setHistory((prev) => [newProblem, ...prev]);
      setProblem("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error in handleSolve:", err);
      setError(err instanceof Error ? err.message : "Failed to solve the problem. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

    if (selectedFile && !validTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, or PDF file.");
      e.target.value = "";
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
  };

  const handleGenerateClick = () => {
    setActiveTab("generate");
    router.push("/generator");
  };

  return (
    <div>
      <QuestionCounter />

      <div className={`tab-container ${isDarkMode ? "tab-container-dark" : "tab-container-light"}`}>
        <button
          onClick={() => setActiveTab("solve")}
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
          onClick={handleGenerateClick}
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
        <div className="space-y-4">
          <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as "text" | "file")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text Input
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload Image/PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Enter math problem"
                className={`input-field ${isDarkMode ? "input-field-dark" : "input-field-light"}`}
              />
            </TabsContent>

            <TabsContent value="file">
              <div className="space-y-2">
                {file ? (
                  <div className={`p-3 rounded-lg border flex items-center justify-between ${isDarkMode ? "border-border bg-secondary" : "border-border bg-secondary"}`}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button
                      onClick={clearFile}
                      className="p-1 rounded-full hover:bg-secondary-foreground/10"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className={`file-input ${isDarkMode ? "file-input-dark" : "file-input-light"}`}
                    />
                    <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload an image or PDF containing a math problem. Supported formats: JPG, JPEG, PNG, PDF.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {extractedText && (
            <Alert variant="default" className="bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                We extracted text from your image but couldn't solve it automatically. Please review the text in the
                input field and try again.
              </AlertDescription>
            </Alert>
          )}

          <button
            onClick={handleSolve}
            disabled={isProcessing}
            className={`submit-button ${isDarkMode ? "submit-button-dark" : "submit-button-light"}`}
          >
            <BrainCircuit className="h-5 w-5" />
            {isProcessing ? "Solving, please wait..." : "Solve with AI"}
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className={`content-container ${isDarkMode ? "content-container-dark" : "content-container-light"}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            History
          </h2>
          <div className="space-y-4">
            {history.map((problem) => (
              <div key={problem.id} className={`history-item ${isDarkMode ? "history-item-dark" : "history-item-light"}`}>
                <h3 className="font-semibold mb-1">Problem:</h3>
                <Math>{problem.question}</Math>
                {problem.solution && (
                  <>
                    <h3 className="font-semibold mt-4 mb-1">Solution:</h3>
                    <Math>{problem.solution}</Math>
                  </>
                )}
                <p className="text-sm mt-2 text-muted-foreground">{problem.timestamp.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
