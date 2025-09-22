"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Search,
  User,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  ExternalLink,
  Tags,
  Globe,
  Building2,
  Bell,
  Menu,
  Home,
  Briefcase,
  CalendarDays,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { apiRequest } from "@/lib/api"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchTerm = searchParams.get("search_term") || ""
  const [searchQuery, setSearchQuery] = useState(searchTerm)
  const [locationQuery, setLocationQuery] = useState("")
  const [firstName, setFirstName] = useState<string>("")
  const [jobs, setJobs] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)

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
      const res = await apiRequest(
        `api/jobs/feed/?page=${page}&page_size=10&search_term=${encodeURIComponent(searchTerm)}`,
        "GET",
        undefined,
        { auth: true }
      )
      setLoading(false)
      if (res && res.jobs) {
        setJobs(prev => page === 1 ? res.jobs : [...prev, ...res.jobs])
        setTotalPages(res.total_pages || 1)
        setHasMore(page < (res.total_pages || 1))
      }
    }
    if (searchTerm) {
      fetchJobs()
    }
  }, [page, searchTerm])

  useEffect(() => {
    setPage(1)
    setJobs([])
    setHasMore(true)
  }, [searchTerm])

  // Infinite scroll effect
  useEffect(() => {
    if (!hasMore || loading) return
    const handleScroll = () => {
      if (
        loaderRef.current &&
        loaderRef.current.getBoundingClientRect().top <= window.innerHeight
      ) {
        setPage(prev => (hasMore && !loading ? prev + 1 : prev))
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasMore, loading])

  function capitalize(str: string) {
    if (!str) return ""
    return str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ")
  }

  function parseDate(dateStr?: string): Date | null {
    if (!dateStr) return null
    let d = new Date(dateStr)
    if (!isNaN(d.getTime())) return d
    const shortToFull: Record<string, string> = {
      Jan: "January", Feb: "February", Mar: "March", Apr: "April",
      May: "May", Jun: "June", Jul: "July", Aug: "August",
      Sep: "September", Oct: "October", Nov: "November", Dec: "December"
    }
    const parts = dateStr.split(" ")
    if (parts.length === 3 && shortToFull[parts[0]]) {
      const fullDateStr = dateStr.replace(parts[0], shortToFull[parts[0]])
      d = new Date(fullDateStr)
      if (!isNaN(d.getTime())) return d
    }
    return null
  }

  function isOutdated(deadline?: string) {
    const deadlineDate = parseDate(deadline)
    if (!deadlineDate) return false
    const now = new Date()
    return deadlineDate < now
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* ...background and header code identical to HomePage... */}
      <header className="relative z-20 bg-transparent backdrop-blur-sm border-b border-blue-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">JA</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">NextSira</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/home" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                Dashboard
              </a>
              <a href="/resume-enhancer" className="text-gray-700 hover:text-blue-600 transition-colors">
                Resume Enhancer
              </a>
              <a href="/applications" className="text-gray-700 hover:text-blue-600 transition-colors">
                Applications
              </a>
            </nav>
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

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Search Results for "{searchTerm}"
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Showing jobs matching your search.
          </p>
          <Card className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm border-blue-200 shadow-2xl rounded-2xl sm:rounded-3xl">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-16 text-base sm:text-lg border-blue-200 focus:border-blue-400 rounded-xl bg-white/50"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-16 text-base sm:text-lg border-blue-200 focus:border-blue-400 rounded-xl bg-white/50"
                />
              </div>
              <button
                className="group flex items-center bg-transparent border-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center sm:justify-start"
                onClick={() => {
                  if (searchQuery.trim()) {
                    router.push(`/home/search?search_term=${encodeURIComponent(searchQuery.trim())}`)
                  }
                }}
              >
                <div className="bg-lime-400 px-4 sm:px-6 py-3 sm:py-5 flex items-center group-hover:bg-lime-300 transition-colors">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="bg-black text-white px-6 sm:px-8 py-3 sm:py-5 font-semibold text-base sm:text-lg group-hover:bg-gray-800 transition-colors flex-1 sm:flex-initial">
                  Search Jobs
                </div>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-blue-200 hover:bg-blue-50 bg-white/50 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm"
                >
                  Remote
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm"
                >
                  Full-time
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm"
                >
                  $100k+
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Results</h2>
            <Button variant="outline" size="lg" className="rounded-xl border-blue-200 hover:bg-blue-50 bg-white/50">
              <Bell className="h-4 w-4 mr-2" />
              Set Alerts
            </Button>
          </div>

          <div className="grid gap-8">
            {jobs.map((job, idx) => (
              <Link
                key={job.id}
                href={`/job/${job.id}`}
                className="block group"
                style={{ textDecoration: "none" }}
              >
                <Card
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-200 rounded-2xl relative cursor-pointer"
                >
                  <button
                    tabIndex={-1}
                    aria-label={`View job ${job.title}`}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {job.title && (
                            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                              <Briefcase className="h-6 w-6 text-blue-500" />
                              {job.title}
                              {isOutdated(job.deadline) && (
                                <Badge className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-xl text-xs">
                                  Outdated
                                </Badge>
                              )}
                              {typeof job.match_percentage === "number" && (
                                <Badge className="ml-2 bg-lime-100 text-lime-800 px-2 py-1 rounded-xl text-xs font-semibold">
                                  {job.match_percentage}% match
                                </Badge>
                              )}
                            </CardTitle>
                          )}
                        </div>
                        {job.company && (
                          <p className="text-blue-600 font-semibold text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {job.company}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="lg" className="rounded-xl hover:bg-blue-50" tabIndex={-1}>
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-2">
                      {job.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium" title={Array.isArray(job.location) ? job.location.join(", ") : job.location}>
                            {Array.isArray(job.location)
                              ? capitalize(job.location.join(", "))
                              : capitalize(job.location)}
                          </span>
                        </div>
                      ) : (
                        <>
                          {job.country && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <span className="font-medium" title={job.country}>
                                {capitalize(job.country)}
                              </span>
                            </div>
                          )}
                          {job.city && (
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              <span className="font-medium" title={job.city}>
                                {capitalize(job.city)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      {job.deadline && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium" title={job.deadline}>
                            {capitalize(job.deadline)}
                          </span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium" title={job.salary}>
                            {capitalize(job.salary)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
                      {job.category && (
                        <div className="flex items-center gap-2">
                          <Tags className="h-4 w-4" />
                          <span className="font-medium" title={job.category}>
                            {capitalize(job.category)}
                          </span>
                        </div>
                      )}
                      {job.posted_date && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span className="font-medium" title={job.posted_date}>
                            {capitalize(job.posted_date)}
                          </span>
                        </div>
                      )}
                      {job.is_online !== null && (
                        <div className="flex items-center gap-2">
                          <Globe className={`h-4 w-4 ${job.is_online ? "text-lime-600" : "text-gray-400"}`} />
                          <span className="font-medium" title={job.is_online ? "Online Application" : "In-person Application"}>
                            {job.is_online ? "Online Application" : "In-person Application"}
                          </span>
                        </div>
                      )}
                      {job.is_remote !== null && (
                        <div className="flex items-center gap-2">
                          <Home className={`h-4 w-4 ${job.is_remote ? "text-purple-600" : "text-gray-400"}`} />
                          <span className="font-medium" title={job.is_remote ? "Remote" : "Onsite"}>
                            {job.is_remote ? "Remote" : "Onsite"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {Array.isArray(job.skills) && job.skills.slice(0, 3).map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="border-blue-200 text-blue-700 px-3 py-1 rounded-xl flex items-center gap-1"
                          >
                            <Tags className="h-4 w-4" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      {job.job_link && (
                        <Link href={job.job_link} target="_blank" rel="noopener noreferrer">
                          <button className="group flex items-center bg-transparent border-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="bg-lime-400 px-4 py-3 flex items-center group-hover:bg-lime-300 transition-colors">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                            <div className="bg-black text-white px-6 py-3 font-semibold group-hover:bg-gray-800 transition-colors flex items-center">
                              View Details
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </div>
                          </button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div ref={loaderRef} className="flex justify-center mt-8">
            {loading && <span className="px-4 py-2 font-semibold">Loading...</span>}
            {!hasMore && <span className="px-4 py-2 text-gray-500">No more jobs</span>}
          </div>
        </div>
      </main>
    </div>
  )
}