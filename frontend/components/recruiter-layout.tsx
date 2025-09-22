"use client"

import type React from "react"

import { useEffect } from "react"
import { RecruiterHeader } from "./recruiter-header"
import { RecruiterSidebar } from "./recruiter-sidebar"

interface RecruiterLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function RecruiterLayout({ children, showSidebar = true }: RecruiterLayoutProps) {
  useEffect(() => {
    // Initialize theme on mount
    if (!document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light")) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {showSidebar && <RecruiterSidebar />}
        <main className={showSidebar ? "flex-1 p-6" : "flex-1 p-6"}>{children}</main>
      </div>
    </div>
  )
}
