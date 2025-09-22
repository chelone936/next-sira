"use client"

import { useState } from "react"
import {
  ArrowLeft,
  MapPin,
  User,
  Bell,
  Menu,
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Calendar,
  Star,
  Edit,
  Download,
  ExternalLink,
  Building,
  Clock,
  Award,
  Target,
  FileText,
  Settings,
  Camera,
  LinkedinIcon,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock user data based on the UserProfile model
const mockUser = {
  first_name: "Sarah",
  last_name: "Johnson",
  age: 28,
  gender: "female",
  job_title: "Senior Frontend Developer",
  experience: "senior",
  location: "San Francisco, CA",
  bio: "Passionate frontend developer with 7+ years of experience building scalable web applications. I specialize in React, TypeScript, and modern web technologies. Always eager to learn new technologies and contribute to innovative projects.",
  skills: "React, TypeScript, JavaScript, Next.js, Tailwind CSS, Node.js, GraphQL, AWS, Docker, Git",
  linkedin_url: "https://linkedin.com/in/sarahjohnson",
  portfolio_url: "https://sarahjohnson.dev",
  preferred_locations: "San Francisco, New York, Remote",
  job_types: "full-time",
  created_at: "2023-01-15",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
}

// Mock applications data
const mockApplications = [
  {
    id: 1,
    job_title: "Senior React Developer",
    company: "TechCorp Inc.",
    status: "pending",
    applied_date: "2024-01-15",
    match_percentage: 92,
    location: "San Francisco, CA",
    salary: "$120k - $150k",
  },
  {
    id: 2,
    job_title: "Frontend Team Lead",
    company: "StartupXYZ",
    status: "interview",
    applied_date: "2024-01-10",
    match_percentage: 88,
    location: "Remote",
    salary: "$130k - $160k",
  },
  {
    id: 3,
    job_title: "Full Stack Developer",
    company: "InnovateLabs",
    status: "rejected",
    applied_date: "2024-01-05",
    match_percentage: 75,
    location: "New York, NY",
    salary: "$110k - $140k",
  },
  {
    id: 4,
    job_title: "React Native Developer",
    company: "MobileFirst",
    status: "accepted",
    applied_date: "2023-12-20",
    match_percentage: 95,
    location: "San Francisco, CA",
    salary: "$125k - $155k",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "interview":
      return "bg-blue-100 text-blue-800"
    case "accepted":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "interview":
      return <Users className="h-4 w-4" />
    case "accepted":
      return <CheckCircle className="h-4 w-4" />
    case "rejected":
      return <XCircle className="h-4 w-4" />
    default:
      return <Eye className="h-4 w-4" />
  }
}

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const skillsArray = mockUser.skills.split(", ")
  const preferredLocationsArray = mockUser.preferred_locations.split(", ")

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

        {/* Scattered dots of various sizes */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-32 left-40 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-16 left-60 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-40 left-80 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-24 right-20 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-36 right-40 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-20 right-60 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-44 right-80 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-40 left-32 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-32 left-52 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-48 right-32 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-36 right-52 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>

        {/* Large circles */}
        <div className="absolute top-24 left-1/4 w-16 h-16 border border-blue-300 rounded-full opacity-50"></div>
        <div className="absolute top-40 right-1/4 w-20 h-20 border border-blue-300 rounded-full opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/6 w-12 h-12 border border-blue-300 rounded-full opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/6 w-14 h-14 border border-blue-300 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-blue-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/2 right-1/3 w-18 h-18 border border-blue-300 rounded-full opacity-30"></div>
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
              <Link href="/home" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <a href="/matches" className="text-gray-700 hover:text-blue-600 transition-colors">
                Job Matches
              </a>
              <a href="/applications" className="text-gray-700 hover:text-blue-600 transition-colors">
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
                  <span className="font-medium text-blue-600">{mockUser.first_name}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-2xl rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-blue-200">
                      <AvatarImage src="/professional-woman-developer.png" />
                      <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                        {mockUser.first_name[0]}
                        {mockUser.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-lime-400 hover:bg-lime-500 text-black"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {mockUser.first_name} {mockUser.last_name}
                        </h1>
                        <p className="text-xl text-blue-600 font-semibold mb-2 flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          {mockUser.job_title}
                        </p>
                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{mockUser.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{mockUser.age} years old</span>
                          </div>
                          <Badge className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
                            {mockUser.experience.charAt(0).toUpperCase() + mockUser.experience.slice(1)} Level
                          </Badge>
                        </div>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">{mockUser.bio}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" className="rounded-xl flex items-center gap-2 bg-transparent">
                        <Mail className="h-4 w-4" />
                        {mockUser.email}
                      </Button>
                      <Button variant="outline" className="rounded-xl flex items-center gap-2 bg-transparent">
                        <Phone className="h-4 w-4" />
                        {mockUser.phone}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tab Navigation */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl">
              <CardContent className="p-0">
                <div className="flex border-b border-blue-200">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeTab === "overview"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("applications")}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeTab === "applications"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Applications ({mockApplications.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("skills")}
                    className={`px-6 py-4 font-medium transition-colors ${
                      activeTab === "skills"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Skills & Experience
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Quick Stats */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{mockApplications.length}</div>
                          <div className="text-sm text-gray-600">Total Applications</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {
                              mockApplications.filter((app) => app.status === "interview" || app.status === "accepted")
                                .length
                            }
                          </div>
                          <div className="text-sm text-gray-600">Active Opportunities</div>
                        </div>
                        <div className="bg-lime-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-lime-600 mb-1">
                            {Math.round(
                              mockApplications.reduce((acc, app) => acc + app.match_percentage, 0) /
                                mockApplications.length,
                            )}
                            %
                          </div>
                          <div className="text-sm text-gray-600">Avg Match Score</div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          Recent Applications
                        </h3>
                        <div className="space-y-3">
                          {mockApplications.slice(0, 3).map((app) => (
                            <div key={app.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getStatusColor(app.status)}`}>
                                  {getStatusIcon(app.status)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{app.job_title}</div>
                                  <div className="text-sm text-gray-600">
                                    {app.company} • {app.applied_date}
                                  </div>
                                </div>
                              </div>
                              <Badge className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
                                {app.match_percentage}% match
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "applications" && (
                    <div className="space-y-4">
                      {mockApplications.map((app) => (
                        <Card key={app.id} className="border-blue-200 hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.job_title}</h3>
                                <p className="text-blue-600 font-medium mb-2 flex items-center gap-2">
                                  <Building className="h-4 w-4" />
                                  {app.company}
                                </p>
                                <div className="flex items-center gap-4 text-gray-600 text-sm">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {app.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Applied {app.applied_date}
                                  </div>
                                  <div className="text-green-600 font-medium">{app.salary}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className="bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
                                  {app.match_percentage}% match
                                </Badge>
                                <Badge
                                  className={`px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(app.status)}`}
                                >
                                  {getStatusIcon(app.status)}
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {activeTab === "skills" && (
                    <div className="space-y-6">
                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="h-5 w-5 text-blue-500" />
                          Technical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skillsArray.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="border-blue-200 text-blue-700 px-3 py-2 rounded-xl"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Experience Level */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-blue-500" />
                          Experience Level
                        </h3>
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              {mockUser.experience.charAt(0).toUpperCase() + mockUser.experience.slice(1)} Level
                            </span>
                            <span className="text-sm text-gray-600">7+ years</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>

                      {/* Job Preferences */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          Job Preferences
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-xl p-4">
                            <div className="font-medium text-gray-900 mb-2">Preferred Locations</div>
                            <div className="flex flex-wrap gap-2">
                              {preferredLocationsArray.map((location) => (
                                <Badge
                                  key={location}
                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs"
                                >
                                  {location}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-4">
                            <div className="font-medium text-gray-900 mb-2">Job Type</div>
                            <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                              {mockUser.job_types.charAt(0).toUpperCase() +
                                mockUser.job_types.slice(1).replace("-", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Resume
                </Button>
                <Button variant="outline" className="w-full rounded-xl flex items-center gap-2 bg-transparent">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full rounded-xl flex items-center gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  View Applications
                </Button>
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Professional Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href={mockUser.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <LinkedinIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">LinkedIn</div>
                    <div className="text-xs text-gray-600">Professional network</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </a>
                <a
                  href={mockUser.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-lime-50 rounded-xl hover:bg-lime-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-lime-600 rounded-lg flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Portfolio</div>
                    <div className="text-xs text-gray-600">View my work</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </a>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Profile Completion</span>
                    <span className="text-sm text-gray-600">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Great job! Your profile is almost complete.</p>
                  <p className="text-blue-600">• Add work samples to reach 100%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
