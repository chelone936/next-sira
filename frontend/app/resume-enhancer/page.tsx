"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Upload,
  Download,
  Sparkles,
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { apiRequest } from "@/lib/api"

export default function ResumeEnhancerPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [firstName, setFirstName] = useState<string>("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)

  // Load profile and resume from backend on mount
  useEffect(() => {
    async function fetchProfile() {
      const res = await apiRequest("api/user/profile/", "GET", undefined, { auth: true })
      if (!res || !res.first_name) {
        window.location.href = "/"
        return
      }
      setFirstName(res.first_name)
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    async function fetchResume() {
      try {
        // Use apiRequest to fetch resume metadata or file info
        const res = await apiRequest("api/user/resume/", "GET", undefined, { auth: true })
        // If backend returns a file URL or base64, handle accordingly
        if (res && res.file_url) {
          setResumeUrl(res.file_url)
        } else if (res && res.pdf_base64) {
          // If backend returns base64 PDF
          const pdfBlob = new Blob([Uint8Array.from(atob(res.pdf_base64), c => c.charCodeAt(0))], { type: "application/pdf" })
          setResumeUrl(URL.createObjectURL(pdfBlob))
        }
        // If you expect a file blob, you may need to adjust api.ts to support blob responses
      } catch (err) {
        // Ignore errors
      }
    }
    fetchResume()
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setIsAnalyzing(true)
      const formData = new FormData()
      formData.append("resume", file)
      try {
        const result = await apiRequest("api/user/enhance-resume/", "POST", formData, { auth: true })
        if (result && result.html) { // <-- Accept if html exists
          setAnalysisResult(result)
          setAnalysisComplete(true)
        } else {
          alert(result.error || "Enhancement failed.")
        }
      } catch (err) {
        alert("Failed to enhance resume.")
      }
      setIsAnalyzing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResumeFile(file)
        setIsAnalyzing(true)
        const formData = new FormData()
        formData.append("resume", file)
        try {
          const result = await apiRequest("api/user/enhance-resume/", "POST", formData, { auth: true })
          if (result && result.html) { // <-- Accept if html exists
            setAnalysisResult(result)
            setAnalysisComplete(true)
          } else {
            alert(result.error || "Enhancement failed.")
          }
        } catch (err) {
          alert("Failed to enhance resume.")
        }
        setIsAnalyzing(false)
      } else {
        alert("Please upload a PDF, DOC, or DOCX file.")
      }
    }
  }

  const triggerFileInput = () => {
    const fileInput = document.getElementById("resume-upload") as HTMLInputElement
    fileInput?.click()
  }

  const improvements = [
    {
      type: "Critical",
      title: "Add quantifiable achievements",
      description: "Include specific numbers and metrics to demonstrate impact",
      example: "Increased sales by 25% → Increased sales by 25% ($2.3M revenue) over 6 months",
      status: "pending",
    },
    {
      type: "Important",
      title: "Optimize for ATS keywords",
      description: "Include industry-specific keywords to pass applicant tracking systems",
      example: "Add keywords like 'React', 'TypeScript', 'Agile methodology'",
      status: "pending",
    },
    {
      type: "Moderate",
      title: "Improve action verbs",
      description: "Use stronger, more impactful action verbs",
      example: "Worked on → Led, Spearheaded, Orchestrated",
      status: "applied",
    },
    {
      type: "Minor",
      title: "Format consistency",
      description: "Ensure consistent formatting throughout the document",
      example: "Standardize date formats and bullet point styles",
      status: "applied",
    },
  ]

  async function downloadResume() {
    try {
      const res = await fetch("/api/user/resume/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          // Accept: "*/*" // You can add this if needed
        },
      });
      if (!res.ok) {
        alert("Resume not found or download failed.");
        return;
      }
      const blob = await res.blob();
      // Get filename from Content-Disposition header if available
      let filename = "resume";
      const disposition = res.headers.get("Content-Disposition");
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download resume.");
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="absolute inset-0">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #3b82f6 1px, transparent 1px),
                linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
        {/* Dotted pattern overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, #60a5fa 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        {/* Large circular elements for visual depth */}
        <div className="absolute top-32 left-16 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-96 right-32 w-96 h-96 bg-lime-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>
        {/* Scattered accent dots */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-lime-400 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-blue-500 rounded-full opacity-60"></div>
        <div className="absolute bottom-40 left-32 w-4 h-4 bg-lime-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-32 right-52 w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
      </div>

      <header className="relative z-20 bg-transparent backdrop-blur-sm border-b border-blue-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">JA</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">NextSira</span>
            </div>
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/home" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                Dashboard
              </a>
              <a href="/resume-enhancer" className="text-blue-600 font-semibold">
                Resume Enhancer
              </a>

              <a href="/applications" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Applications
              </a>
            </nav>
            {/* User Profile */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium text-gray-900">{firstName}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI Resume
              <span className="block text-blue-600">Enhancer</span>
            </h1>
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
              Transform your resume with AI-powered insights. Get personalized recommendations to stand out to employers
              and pass ATS systems.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20">
          {!analysisComplete ? (
            <div className="max-w-2xl mx-auto">
              <Card className="p-12 bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
                <CardContent className="p-0">
                  {!resumeFile && !resumeUrl ? (
                    <div
                      className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 cursor-pointer ${
                        isDragOver
                          ? "border-blue-500 bg-blue-50/80 scale-105"
                          : "border-blue-300 hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <Upload className="h-20 w-20 text-blue-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Your Resume</h3>
                      <p className="text-lg text-gray-600 mb-8">Drop your resume here or click to browse</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          triggerFileInput()
                        }}
                        className="group flex items-center bg-transparent border-0 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mx-auto"
                      >
                        <div className="bg-lime-400 px-8 py-5 flex items-center group-hover:bg-lime-300 transition-colors">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                        </div>
                        <div className="bg-black text-white px-12 py-5 font-semibold text-xl group-hover:bg-gray-800 transition-colors">
                          Choose File
                        </div>
                      </button>
                      <p className="text-sm text-gray-500 mt-6">Supports PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      {resumeFile ? (
                        <>
                          <FileText className="h-20 w-20 text-blue-500 mx-auto mb-6" />
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{resumeFile.name}</h3>
                          <p className="text-gray-600 mb-8">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                      ) : (
                        <>
                          <FileText className="h-20 w-20 text-blue-500 mx-auto mb-6" />
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Uploaded Resume</h3>
                          <div className="mb-8">
                            <a
                              href={resumeUrl!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline font-medium"
                            >
                              View Resume
                            </a>
                          </div>
                          <Button
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 text-lg font-semibold"
                            onClick={async () => {
                              setIsEnhancing(true)
                              try {
                                const res = await apiRequest("api/user/enhance-user-resume/", "POST", undefined, { auth: true })
                                if (res && res.pdf_base64) {
                                  setAnalysisResult(res)
                                  setAnalysisComplete(true)
                                  // To download PDF:
                                  const pdfBlob = new Blob([Uint8Array.from(atob(res.pdf_base64), c => c.charCodeAt(0))], { type: "application/pdf" })
                                  const url = window.URL.createObjectURL(pdfBlob)
                                  // Use this url for download button
                                } else {
                                  alert("Enhancement failed.")
                                }
                              } catch (err) {
                                alert("Failed to enhance resume.")
                              }
                              setIsEnhancing(false)
                            }}
                            disabled={isEnhancing}
                          >
                            {isEnhancing ? "Enhancing..." : "Enhance Resume"}
                          </Button>
                        </>
                      )}
                      {isAnalyzing && (
                        <div className="flex items-center justify-center gap-4 mb-8">
                          <Sparkles className="h-6 w-6 text-blue-500 animate-spin" />
                          <span className="text-xl text-blue-600 font-semibold">AI is analyzing your resume...</span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setResumeFile(null)
                          setResumeUrl(null)
                          setAnalysisComplete(false)
                          setIsAnalyzing(false)
                        }}
                        className="rounded-2xl border-blue-300 hover:bg-blue-50 bg-white/70 px-8 py-3 text-lg"
                      >
                        Upload Different File
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            // Analysis Results State
            analysisResult && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl sticky top-8">
                    <CardHeader className="pb-6 text-center">
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Resume Score</CardTitle>
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeDasharray={`${analysisResult.score}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold text-blue-600">{analysisResult.score}</span>
                        </div>
                      </div>
                      <p className="text-lg text-gray-600">Good - Room for improvement</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">ATS Compatibility</span>
                          <span className="font-bold text-green-600">{analysisResult.subscores.ats}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Keyword Match</span>
                          <span className="font-bold text-orange-600">{analysisResult.subscores.keywords}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Impact Score</span>
                          <span className="font-bold text-red-600">{analysisResult.subscores.impact}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Format Score</span>
                          <span className="font-bold text-green-600">{analysisResult.subscores.format}%</span>
                        </div>
                      </div>
                      <div className="mt-8 flex flex-col gap-4">
                        <Button
                          className="group flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 transform hover:scale-105 w-full px-6 py-4 font-semibold"
                          onClick={() => {
                            // Download HTML as .html file
                            const htmlContent = analysisResult.html || "<!-- No HTML available -->"
                            const blob = new Blob([htmlContent], { type: "text/html" })
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = "enhanced_resume.html"
                            a.click()
                            window.URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download HTML
                        </Button>
                        <div className="border rounded-xl mt-4 overflow-hidden" style={{height: 400}}>
                          {/* Preview the enhanced resume HTML */}
                          <iframe
                            srcDoc={analysisResult.html}
                            title="Enhanced Resume Preview"
                            style={{width: "100%", height: "100%", border: "none"}}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-2">
                  <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
                    <CardHeader className="pb-8">
                      <CardTitle className="text-4xl font-bold text-gray-900 mb-3">AI Recommendations</CardTitle>
                      <p className="text-xl text-gray-600">Personalized suggestions to improve your resume</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {analysisResult.improvements.map((improvement: any, index: number) => (
                          <div
                            key={index}
                            className="border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant={
                                    improvement.type === "Critical"
                                      ? "destructive"
                                      : improvement.type === "Important"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="rounded-full px-3 py-1"
                                >
                                  {improvement.type}
                                </Badge>
                                <h3 className="font-bold text-lg text-gray-900">{improvement.title}</h3>
                              </div>
                              {improvement.status === "applied" ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              ) : (
                                <AlertCircle className="h-6 w-6 text-orange-500" />
                              )}
                            </div>
                            <p className="text-gray-700 mb-4 text-lg leading-relaxed">{improvement.description}</p>
                            <div className="bg-blue-50 rounded-xl p-4">
                              <p className="text-blue-800">
                                <span className="font-semibold">Example:</span> {improvement.example}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  )
}
