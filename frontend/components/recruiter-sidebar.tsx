"use client"

import { LayoutDashboard, Briefcase, Users, Star, Heart, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/recruiter", icon: LayoutDashboard },
      { name: "Job Postings", href: "/recruiter/jobs", icon: Briefcase },
    ],
  },
  {
    title: "CANDIDATES",
    items: [
      { name: "All Candidates", href: "/recruiter/candidates", icon: Users },
      { name: "Shortlisted", href: "/recruiter/candidates?status=shortlisted", icon: Star },
      { name: "Favorites", href: "/recruiter/candidates?status=favorites", icon: Heart },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { name: "Reports", href: "/recruiter/analytics", icon: FileText },
      { name: "Insights", href: "/recruiter/analytics?tab=insights", icon: TrendingUp },
    ],
  },
]

export function RecruiterSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/recruiter" && pathname === "/recruiter") return true
    if (href !== "/recruiter" && pathname.startsWith(href.split("?")[0])) return true
    return false
  }

  return (
    <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-sm">
      <div className="p-6">
        <nav className="space-y-8">
          {sidebarItems.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
