"use client"

import { useState } from "react"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  Download,
  Filter,
  Bell,
  Settings,
  User,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { RecruiterLayout } from "@/components/recruiter-layout"

export default function RecruiterAnalytics() {
  const [timeRange, setTimeRange] = useState("Last 30 days")

  return (
    <RecruiterLayout>
      {/* Header */}
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
              <Link href="/recruiter" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/recruiter/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
                Jobs
              </Link>
              <Link
                href="/recruiter/candidates"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Candidates
              </Link>
              <Link href="/recruiter/analytics" className="text-foreground font-medium">
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
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground mt-1">Comprehensive insights into your recruitment performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              {timeRange}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-primary text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Application Trends */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Application Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Application trends chart would be displayed here</p>
                  <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">Applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-muted-foreground">Interviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Distribution */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <PieChart className="h-5 w-5 text-chart-2" />
                Skills Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Skills distribution pie chart would be displayed here</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">React (35%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-muted-foreground">Node.js (28%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                      <span className="text-muted-foreground">Python (22%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-chart-4 rounded-full"></div>
                      <span className="text-muted-foreground">Other (15%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Sources */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-chart-3" />
                Candidate Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Candidate source distribution chart</p>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">LinkedIn</span>
                      <span className="text-foreground font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Indeed</span>
                      <span className="text-foreground font-medium">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Direct Apply</span>
                      <span className="text-foreground font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Referrals</span>
                      <span className="text-foreground font-medium">9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Funnel */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-chart-4" />
                Hiring Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center w-full">
                  <div className="space-y-3">
                    <div className="bg-primary/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Applications</span>
                        <span className="text-sm font-bold text-foreground">153</span>
                      </div>
                    </div>
                    <div className="bg-accent/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Screened</span>
                        <span className="text-sm font-bold text-foreground">89</span>
                      </div>
                    </div>
                    <div className="bg-chart-3/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Interviewed</span>
                        <span className="text-sm font-bold text-foreground">28</span>
                      </div>
                    </div>
                    <div className="bg-chart-4/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Hired</span>
                        <span className="text-sm font-bold text-foreground">8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-foreground font-medium">High Demand Skills</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    React and Node.js are the most requested skills this month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground font-medium">Best Performing Jobs</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Senior Frontend Developer has the highest application rate
                  </p>
                </div>
                <div className="p-3 bg-chart-3/10 rounded-lg border border-chart-3/20">
                  <p className="text-sm text-foreground font-medium">Conversion Rate</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Interview to hire rate improved by 15% this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Diversity Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gender Distribution</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      52% F
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      48% M
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Experience Levels</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      Jr: 35%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Sr: 65%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Geographic Spread</span>
                  <Badge variant="outline" className="text-xs">
                    8 States
                  </Badge>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-xs text-foreground">Diversity goals are being met across all hiring categories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Performance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">⚠️ Low Application Rate</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    UX Designer position has 40% fewer applications than average
                  </p>
                </div>
                <div className="p-3 bg-chart-4/10 rounded-lg border border-chart-4/20">
                  <p className="text-sm text-chart-4 font-medium">📈 High Interest</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Backend Engineer role is trending with 23 new applications this week
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">✅ Goal Achieved</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monthly hiring target reached with 2 weeks remaining
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </RecruiterLayout>
  )
}
