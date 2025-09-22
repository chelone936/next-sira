"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Building,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RecruiterLayout } from "@/components/recruiter-layout"
import { RecruiterHeader } from "@/components/recruiter-header"
import Link from "next/link"
import { apiRequest } from "@/lib/api"
import { useRouter } from "next/navigation"

// Mock sidebar data
const mockActivities = [
  { type: "job", message: "Senior Frontend Developer posted", time: "1 hour ago" },
  { type: "job", message: "Product Manager paused", time: "2 hours ago" },
  { type: "job", message: "Backend Engineer deadline updated", time: "1 day ago" },
  { type: "job", message: "UX Designer deleted", time: "2 days ago" },
]
const mockStats = [
  { label: "Active Jobs", value: "12" },
  { label: "Total Applicants", value: "153" },
  { label: "Avg Response Time", value: "2.3 days" },
  { label: "Top Skill Demand", value: "React" },
]

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [firstName, setFirstName] = useState<string>("")
  const router = useRouter()

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
    async function fetchJobs() {
      setLoading(true)
      setError(null)
      const res = await apiRequest("api/jobs/recruiter/jobs/", "GET", undefined, { auth: true })
      setLoading(false)
      if (res && res.jobs) {
        setJobs(res.jobs)
      } else {
        setError(res?.error || "Failed to load jobs")
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-accent text-accent-foreground"
      case "Paused":
        return "bg-chart-4/20 text-chart-4"
      case "Draft":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <>
      <RecruiterHeader firstName={firstName} />
      <RecruiterLayout>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Job Postings</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome{firstName ? `, ${firstName}` : ""}! Manage all your job postings and track their performance
                </p>
              </div>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={() => router.push("/recruiter/jobs/new-job/")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Job
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <div className="flex items-center gap-2">
                {["All", "Active", "Paused", "Draft"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? "bg-primary text-primary-foreground" : ""}
                  >
                    {status}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Jobs Grid */}
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {job.city}, {job.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{job.job_type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Posted: {job.posted_date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Deadline: {job.deadline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/recruiter/jobs/${job.id}/candidates`}>
                          <Button variant="outline" size="sm" className="hover:bg-primary/10 bg-transparent">
                            <Users className="h-4 w-4 mr-2" />
                            View Candidates
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Quick Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className="text-sm font-medium text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </RecruiterLayout>
    </>
  )
}
