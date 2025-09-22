"use client"

import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function RecruiterHeader({ firstName }: { firstName: string }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/recruiter" && pathname === "/recruiter") return true
    if (path !== "/recruiter" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">NS</span>
            </div>
            <span className="font-bold text-xl text-foreground">NextSira Recruiter</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <Link
              href="/recruiter"
              className={
                isActive("/recruiter")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Dashboard
            </Link>
            <Link
              href="/recruiter/jobs"
              className={
                isActive("/recruiter/jobs")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Jobs
            </Link>
            <Link
              href="/recruiter/candidates"
              className={
                isActive("/recruiter/candidates")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Candidates
            </Link>
            <Link
              href="/recruiter/analytics"
              className={
                isActive("/recruiter/analytics")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{firstName || "Admin"}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
