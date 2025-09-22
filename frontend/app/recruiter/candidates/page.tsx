"use client"

import { useState } from "react"
import {
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
  Bell,
  Settings,
  User,
  Download,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { RecruiterLayout } from "@/components/recruiter-layout"

const mockCandidates = [
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
    jobApplied: "Senior Frontend Developer",
  },
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
    jobApplied: "Backend Engineer",
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
    jobApplied: "Senior Frontend Developer",
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
    jobApplied: "Backend Engineer",
  },
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
    jobApplied: "UX Designer",
  },
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
    jobApplied: "Product Manager",
  },
]

export default function RecruiterCandidates() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)

  const filteredCandidates = mockCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      candidate.jobApplied.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Link href="/recruiter/candidates" className="text-foreground font-medium">
                Candidates
              </Link>
              <Link
                href="/recruiter/analytics"
                className="text-muted-foreground hover:text-foreground transition-colors"
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
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-1">Review and manage all candidate applications</p>
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
                        <p className="text-sm text-muted-foreground mb-1">
                          Applied for: <span className="text-foreground font-medium">{candidate.jobApplied}</span>
                        </p>
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

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No candidates found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

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
                        <span className="text-sm text-foreground font-medium">{selectedCandidate.jobApplied}</span>
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
