"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Bell,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Menu,
  Filter,
  Search,
} from "lucide-react"
import { apiRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function ApplicationsPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [firstName, setFirstName] = useState<string>("")

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

  const applications = [
    {
      id: 1,
      company: "Google",
      position: "Senior Software Engineer",
      location: "Mountain View, CA",
      appliedDate: "2024-01-15",
      status: "interview",
      salary: "$180K - $220K",
      nextStep: "Technical Interview - Jan 25, 2024",
      matchScore: 95,
      logo: "🔍",
    },
    {
      id: 2,
      company: "Meta",
      position: "Full Stack Developer",
      location: "Menlo Park, CA",
      appliedDate: "2024-01-12",
      status: "pending",
      salary: "$160K - $200K",
      nextStep: "Waiting for response",
      matchScore: 88,
      logo: "📘",
    },
    {
      id: 3,
      company: "Netflix",
      position: "Frontend Engineer",
      location: "Los Gatos, CA",
      appliedDate: "2024-01-10",
      status: "accepted",
      salary: "$170K - $210K",
      nextStep: "Offer negotiation",
      matchScore: 92,
      logo: "🎬",
    },
    {
      id: 4,
      company: "Spotify",
      position: "Backend Engineer",
      location: "New York, NY",
      appliedDate: "2024-01-08",
      status: "rejected",
      salary: "$150K - $180K",
      nextStep: "Application closed",
      matchScore: 78,
      logo: "🎵",
    },
    {
      id: 5,
      company: "Airbnb",
      position: "Product Engineer",
      location: "San Francisco, CA",
      appliedDate: "2024-01-05",
      status: "interview",
      salary: "$165K - $195K",
      nextStep: "Final Round - Jan 28, 2024",
      matchScore: 90,
      logo: "🏠",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "interview":
        return <Calendar className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    interview: applications.filter((app) => app.status === "interview").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.3) 1px, transparent 0),
            linear-gradient(90deg, rgb(59 130 246 / 0.1) 1px, transparent 1px),
            linear-gradient(rgb(59 130 246 / 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          }}
        />

        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-lg" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-blue-200/15 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-blue-300/20 rounded-full blur-xl" />
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
              <Link href="/home" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
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
                  <span className="font-medium text-gray-900">{firstName}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">Track your job applications and interview progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="backdrop-blur-md bg-white/80 rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="backdrop-blur-md bg-white/80 rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="backdrop-blur-md bg-white/80 rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-600">{stats.interview}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="backdrop-blur-md bg-white/80 rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="backdrop-blur-md bg-white/80 rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="backdrop-blur-md bg-white/80 rounded-xl p-6 border border-white/20 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 w-full md:w-80"
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="backdrop-blur-md bg-white/80 rounded-xl p-6 border border-white/20 hover:bg-white/90 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {application.logo}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{application.position}</h3>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{application.company}</span>
                      <span>•</span>
                      <span>{application.location}</span>
                      <span>•</span>
                      <span>{application.salary}</span>
                      <span>•</span>
                      <span className="text-lime-600 font-medium">{application.matchScore}% match</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Applied on {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Next: </span>
                        {application.nextStep}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/job/${application.id}`}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
    </div>
  )
}
