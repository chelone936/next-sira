"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
import { RecruiterHeader } from "@/components/recruiter-header"
import {
  Users,
  Briefcase,
  TrendingUp,
  UserCheck,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  X,
  Star,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Download,
  Mail,
  Phone,
  GraduationCap,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RecruiterLayout } from "@/components/recruiter-layout"

// Mock data
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    applicants: 47,
    status: "Active",
    posted: "2 days ago",
    deadline: "Dec 15, 2024",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    applicants: 23,
    status: "Active",
    posted: "1 week ago",
    deadline: "Dec 20, 2024",
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    applicants: 31,
    status: "Paused",
    posted: "3 days ago",
    deadline: "Dec 18, 2024",
  },
  {
    id: 4,
    title: "Backend Engineer",
    department: "Engineering",
    applicants: 52,
    status: "Active",
    posted: "5 days ago",
    deadline: "Dec 22, 2024",
  },
]

const mockCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    fitScore: 94,
    skills: ["React", "TypeScript", "Node.js"],
    experience: "5 years",
    appliedDate: "2 days ago",
    status: "New",
    location: "San Francisco, CA",
    education: "MS Computer Science",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    fitScore: 87,
    skills: ["JavaScript", "Vue.js", "Python"],
    experience: "4 years",
    appliedDate: "1 day ago",
    status: "Reviewed",
    location: "Austin, TX",
    education: "BS Software Engineering",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    fitScore: 91,
    skills: ["React", "GraphQL", "AWS"],
    experience: "6 years",
    appliedDate: "3 days ago",
    status: "Shortlisted",
    location: "New York, NY",
    education: "MS Information Systems",
  },
  {
    id: 4,
    name: "David Kim",
    fitScore: 82,
    skills: ["Angular", "Java", "Docker"],
    experience: "3 years",
    appliedDate: "4 days ago",
    status: "New",
    location: "Seattle, WA",
    education: "BS Computer Science",
  },
]

const mockActivities = [
  {
    type: "application",
    message: "New application from Sarah Chen for Senior Frontend Developer",
    time: "2 minutes ago",
  },
  { type: "shortlist", message: "Elena Rodriguez shortlisted for Senior Frontend Developer", time: "1 hour ago" },
  { type: "interview", message: "Interview scheduled with Marcus Johnson", time: "3 hours ago" },
  { type: "job", message: "UX Designer position paused", time: "1 day ago" },
  { type: "application", message: "New application from David Kim for Backend Engineer", time: "2 days ago" },
]

export default function RecruiterDashboard() {
  const [firstName, setFirstName] = useState<string>("")
  const [selectedJob, setSelectedJob] = useState(mockJobs[0])
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredCandidates = mockCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <>
      <RecruiterHeader firstName={firstName} />
      <RecruiterLayout>
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Job Postings</p>
                  <p className="text-3xl font-bold text-foreground">12</p>
                  <p className="text-xs text-accent flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +2 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applicants</p>
                  <p className="text-3xl font-bold text-foreground">153</p>
                  <p className="text-xs text-accent flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +23 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Candidate Fit</p>
                  <p className="text-3xl font-bold text-foreground">87%</p>
                  <p className="text-xs text-chart-3 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +5% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                  <p className="text-3xl font-bold text-foreground">28</p>
                  <p className="text-xs text-chart-4 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +8 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Postings Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedJob.id === job.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{job.title}</h3>
                            <Badge
                              variant={job.status === "Active" ? "default" : "secondary"}
                              className={job.status === "Active" ? "bg-accent text-accent-foreground" : ""}
                            >
                              {job.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {job.applicants} applicants
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.posted}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Candidate Ranking Table */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-foreground">Candidates for {selectedJob.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-input border-border"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">{candidate.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-chart-4 fill-current" />
                              <span className="text-sm font-medium text-chart-4">{candidate.fitScore}%</span>
                            </div>
                            <Badge
                              variant={candidate.status === "Shortlisted" ? "default" : "secondary"}
                              className={candidate.status === "Shortlisted" ? "bg-accent text-accent-foreground" : ""}
                            >
                              {candidate.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {candidate.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {candidate.experience}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {candidate.appliedDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{candidate.skills.length - 3} more</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Shortlist
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
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

            {/* Quick Stats */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Quick Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Top Skill Demand</span>
                    <span className="text-sm font-medium text-foreground">React</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                    <span className="text-sm font-medium text-foreground">2.3 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interview Rate</span>
                    <span className="text-sm font-medium text-accent">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hire Rate</span>
                    <span className="text-sm font-medium text-accent">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Candidate Detail Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">{selectedCandidate.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-chart-4 fill-current" />
                        <span className="text-sm font-medium text-chart-4">{selectedCandidate.fitScore}% fit</span>
                      </div>
                      <Badge
                        variant={selectedCandidate.status === "Shortlisted" ? "default" : "secondary"}
                        className={selectedCandidate.status === "Shortlisted" ? "bg-accent text-accent-foreground" : ""}
                      >
                        {selectedCandidate.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCandidate(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {selectedCandidate.name.toLowerCase().replace(" ", ".")}@email.com
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{selectedCandidate.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{selectedCandidate.education}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Experience & Skills</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Experience: </span>
                          <span className="text-sm text-foreground">{selectedCandidate.experience}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground mb-2 block">Skills:</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.skills.map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">AI-Generated Summary</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        <strong>Strengths:</strong> Strong technical background with {selectedCandidate.experience} of
                        experience. Excellent fit for the role with {selectedCandidate.fitScore}% compatibility.
                        Proficient in modern technologies including {selectedCandidate.skills.slice(0, 2).join(" and ")}.
                      </p>
                      <p className="text-sm text-foreground leading-relaxed mt-2">
                        <strong>Areas for Growth:</strong> Could benefit from additional experience in cloud technologies
                        and system design patterns.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Suggested Interview Questions</h3>
                    <div className="space-y-2">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm text-foreground">
                          1. Can you walk me through your experience with React and how you've used it in recent projects?
                        </p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm text-foreground">
                          2. How do you approach debugging complex frontend issues?
                        </p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm text-foreground">
                          3. Tell me about a challenging technical problem you solved recently.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Shortlist
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Interview Invite
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                    <Button variant="ghost">Add Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </RecruiterLayout>
    </>
  )
}
