"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Eye,
  UserCheck,
  X,
  User,
  Download,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RecruiterLayout } from "@/components/recruiter-layout"
import Link from "next/link"

// Mock job data
const mockJobs = {
  1: { title: "Senior Frontend Developer", department: "Engineering" },
  2: { title: "Product Manager", department: "Product" },
  3: { title: "UX Designer", department: "Design" },
  4: { title: "Backend Engineer", department: "Engineering" },
  5: { title: "DevOps Engineer", department: "Engineering" },
  6: { title: "Marketing Specialist", department: "Marketing" },
}

// Mock candidates specific to jobs
const mockJobCandidates = {
  1: [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
      fitScore: 94,
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      experience: "5 years",
      appliedDate: "2 days ago",
      status: "New",
      location: "San Francisco, CA",
      education: "MS Computer Science",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      email: "elena.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      fitScore: 91,
      skills: ["React", "GraphQL", "AWS", "Docker", "Kubernetes"],
      experience: "6 years",
      appliedDate: "3 days ago",
      status: "Shortlisted",
      location: "New York, NY",
      education: "MS Information Systems",
    },
  ],
  2: [
    {
      id: 6,
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
      phone: "+1 (555) 678-9012",
      fitScore: 85,
      skills: ["Product Strategy", "Analytics", "Roadmapping", "Agile", "SQL"],
      experience: "7 years",
      appliedDate: "5 days ago",
      status: "Reviewed",
      location: "Chicago, IL",
      education: "MBA",
    },
  ],
  3: [
    {
      id: 5,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+1 (555) 567-8901",
      fitScore: 89,
      skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
      experience: "4 years",
      appliedDate: "1 week ago",
      status: "Interview Scheduled",
      location: "Los Angeles, CA",
      education: "MFA Design",
    },
  ],
  4: [
    {
      id: 2,
      name: "Marcus Johnson",
      email: "marcus.johnson@email.com",
      phone: "+1 (555) 234-5678",
      fitScore: 87,
      skills: ["JavaScript", "Vue.js", "Python", "Django", "PostgreSQL"],
      experience: "4 years",
      appliedDate: "1 day ago",
      status: "Reviewed",
      location: "Austin, TX",
      education: "BS Software Engineering",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1 (555) 456-7890",
      fitScore: 82,
      skills: ["Angular", "Java", "Docker", "Spring Boot", "MongoDB"],
      experience: "3 years",
      appliedDate: "4 days ago",
      status: "New",
      location: "Seattle, WA",
      education: "BS Computer Science",
    },
  ],
  5: [],
  6: [],
}

export default function JobCandidates() {
  const params = useParams()
  const jobId = Number.parseInt(params.id as string)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)

  const job = mockJobs[jobId as keyof typeof mockJobs]
  const candidates = mockJobCandidates[jobId as keyof typeof mockJobCandidates] || []

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "All" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-primary/20 text-primary"
      case "Reviewed":
        return "bg-chart-2/20 text-chart-2"
      case "Shortlisted":
        return "bg-accent text-accent-foreground"
      case "Interview Scheduled":
        return "bg-chart-4/20 text-chart-4"
      case "Rejected":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <RecruiterLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/recruiter/jobs"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidates for {job.title}</h1>
          <p className="text-muted-foreground mt-1">
            {job.department} • {filteredCandidates.length} candidates
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Candidates
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "New", "Reviewed", "Shortlisted", "Interview Scheduled"].map((status) => (
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

      {/* Candidates Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid gap-4">
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-chart-4 fill-current" />
                          <span className="text-sm font-medium text-chart-4">{candidate.fitScore}%</span>
                        </div>
                        <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{candidate.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{candidate.appliedDate}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                          Education: <span className="text-foreground">{candidate.education}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {candidate.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 4 && (
                          <span className="text-xs text-muted-foreground">+{candidate.skills.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-accent/10">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-chart-2/10">
                      <Mail className="h-4 w-4" />
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
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No candidates found</h3>
          <p className="text-muted-foreground">
            {candidates.length === 0
              ? "No candidates have applied for this position yet."
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      )}

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
                    <Badge className={getStatusColor(selectedCandidate.status)}>{selectedCandidate.status}</Badge>
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
                        <span className="text-foreground">{selectedCandidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedCandidate.phone}</span>
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
                    <h3 className="font-semibold text-foreground mb-3">Application Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Applied for: </span>
                        <span className="text-sm text-foreground font-medium">{job.title}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Experience: </span>
                        <span className="text-sm text-foreground">{selectedCandidate.experience}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Applied: </span>
                        <span className="text-sm text-foreground">{selectedCandidate.appliedDate}</span>
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
                        1. Can you walk me through your experience with {selectedCandidate.skills[0]} and how you've
                        used it in recent projects?
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm text-foreground">
                        2. How do you approach debugging complex technical issues?
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
                  <Button variant="ghost" className="text-destructive hover:text-destructive">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </RecruiterLayout>
  )
}
