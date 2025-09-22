"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { apiRequest } from "@/lib/api"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  ExternalLink,
  Building,
  Users,
  Calendar,
  Star,
  Share2,
  Bell,
  User,
  Menu,
  Home,
  Tags,
  Globe,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  ListOrdered,
  Info,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Dialog } from "@headlessui/react" // If you use headlessui, or use any modal library/component
import { Input } from "@/components/ui/input" // If not already imported

// Add these helpers above your component
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

export default function JobDetailsPage() {
  const params = useParams()
  const jobId = params.id
  const [job, setJob] = useState<any>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [applyResult, setApplyResult] = useState<any>(null)
  const [applyLoading, setApplyLoading] = useState(false)
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showDraftContent, setShowDraftContent] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [coverLetterError, setCoverLetterError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editableCoverLetter, setEditableCoverLetter] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("")

  useEffect(() => {
    async function fetchJob() {
      setLoading(true)
      // ADD { auth: true } here!
      const res = await apiRequest(`api/jobs/${jobId}/`, "GET", undefined, { auth: true })
      setJob(res)
      setLoading(false)
    }
    fetchJob()
  }, [jobId])

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
    if (coverLetter && showDraftContent) {
      setEditableCoverLetter(coverLetter);
    }
  }, [coverLetter, showDraftContent]);

  async function handleApplyOnline() {
    setApplyLoading(true)
    setApplyResult(null)
    try {
      const res = await apiRequest(`api/jobs/${jobId}/apply_online/`, "POST")
      setApplyResult(res)
    } catch (e) {
      setApplyResult({ error: "Failed to apply online." })
    }
    setApplyLoading(false)
  }

  async function handleOpenDraftEmail() {
    setShowDraftContent(true);
    setCoverLetterLoading(true);
    setCoverLetterError(null);
    setCoverLetter(null);
    try {
      const res = await apiRequest(
        "api/user/generate-cover-letter/",
        "POST",
        { job_id: jobId },
        { auth: true }
      );
      if (res.cover_letter) {
        setCoverLetter(res.cover_letter);
      } else {
        setCoverLetterError(res.error || "Failed to generate cover letter.");
      }
    } catch (e: any) {
      setCoverLetterError("Failed to generate cover letter.");
    }
    setCoverLetterLoading(false);
  }

  function handleDraftEmail() {
    setShowEmailPopup(true);
    setShowDraftContent(false);
    setCoverLetter(null);
    setCoverLetterError(null);
  }

  function handleCloseEmailPopup() {
    setShowEmailPopup(false);
    setShowDraftContent(false);
    setCoverLetter(null);
    setCoverLetterError(null);
  }

  function handleCopyCoverLetter() {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  if (loading) return <div>Loading...</div>
  if (!job) return <div>Job not found</div>

  // Defensive fallback for all possibly null/undefined fields
  const skills = Array.isArray(job?.skills) ? job.skills : []
  const tags = Array.isArray(job?.tags) ? job.tags : []
  const location = Array.isArray(job?.location) ? job.location : job?.location ? [job.location] : []
  const salary = job?.salary ?? null
  const salaryMin = job?.salary_min ?? null
  const salaryMax = job?.salary_max ?? null
  const posted = job?.posted_date ?? null
  const match = typeof job?.match_percentage === "number" ? job.match_percentage : 0
  const company = job?.company ?? null
  const category = job?.category ?? null
  const jobType = job?.job_type ?? null
  const experienceLevel = job?.experience_level ?? null
  const degreeRequired = job?.degree_required ?? null
  const cgpa = job?.cgpa ?? null
  const applicationMethod = job?.application_method ?? null
  const applicationInstructions = job?.application_instructions ?? null
  const applicationUrl = job?.application_url ?? null
  const numberOfPositions = job?.number_of_positions ?? null
  const deadline = job?.deadline ?? null
  const address = job?.address ?? null
  const country = job?.country ?? null
  const city = job?.city ?? null
  const gender = job?.gender ?? null
  const agemax = job?.agemax ?? null
  const agemin = job?.agemin ?? null
  const otherRequirements = job?.other_requirements ?? null
  const contactEmail = job?.contact_email ?? null
  const contactPhone = job?.contact_phone ?? null
  const description = job?.description ?? "No description provided."

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

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-2xl rounded-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="h-7 w-7 text-blue-500" />
                        {job.title ?? "Untitled Job"}
                        {isOutdated(deadline) && (
                          <Badge className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-xl text-xs">
                            Outdated
                          </Badge>
                        )}
                        {/* Show match percentage if available */}
                        {typeof match === "number" && (
                          <Badge className="ml-2 bg-lime-100 text-lime-800 text-sm font-semibold px-3 py-1 rounded-full">
                            {match}% match
                          </Badge>
                        )}
                      </CardTitle>
                      <Badge className="bg-lime-100 text-lime-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {match}% match
                      </Badge>
                    </div>
                    {company && (
                      <p className="text-blue-600 font-semibold text-xl mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {company}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                      {location.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          <span className="font-medium">
                            {location.join(", ")}
                          </span>
                        </div>
                      )}
                      {(!location.length && (city || country)) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          <span className="font-medium">
                            {[city, country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      {salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          <span className="font-medium">{salary}</span>
                          {salaryMin && <span className="text-xs text-gray-400">(Min: {salaryMin})</span>}
                          {salaryMax && <span className="text-xs text-gray-400">(Max: {salaryMax})</span>}
                        </div>
                      )}
                      {posted && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">{posted}</span>
                        </div>
                      )}
                      {deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <span className="font-medium">Deadline: {deadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="rounded-xl hover:bg-blue-50"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current text-blue-600" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="lg" className="rounded-xl hover:bg-blue-50">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {skills.length > 0 ? (
                    skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="border-blue-200 text-blue-700 px-3 py-1 rounded-xl flex items-center gap-1 break-all">
                        <Tags className="h-4 w-4" />
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No skills listed</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {tags.length > 0 ? (
                    tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="border-blue-200 text-blue-700 px-3 py-1 rounded-xl flex items-center gap-1">
                        <Tags className="h-4 w-4" />
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No tags listed</span>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-500" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ListOrdered className="h-6 w-6 text-blue-500" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Each grid item */}
                  {category && (
                    <div className="flex items-center gap-3 min-w-0">
                      <Tags className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Category:</span>
                      <span className="truncate break-words">{category}</span>
                    </div>
                  )}
                  {degreeRequired && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Degree Required:</span>
                      <span>{degreeRequired}</span>
                    </div>
                  )}
                  {experienceLevel && (
                    <div className="flex items-center gap-3">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Experience Level:</span>
                      <span>{experienceLevel}</span>
                    </div>
                  )}
                  {jobType && (
                    <div className="flex items-center gap-3">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Job Type:</span>
                      <span>{jobType}</span>
                    </div>
                  )}
                  {numberOfPositions && (
                    <div className="flex items-center gap-3">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Number of Positions:</span>
                      <span>{numberOfPositions}</span>
                    </div>
                  )}
                  {cgpa && (
                    <div className="flex items-center gap-3">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">CGPA:</span>
                      <span>{cgpa}</span>
                    </div>
                  )}
                  {gender && (
                    <div className="flex items-center gap-3">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Gender:</span>
                      <span>{gender}</span>
                    </div>
                  )}
                  {agemin && (
                    <div className="flex items-center gap-3">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Age Min:</span>
                      <span>{agemin}</span>
                    </div>
                  )}
                  {agemax && (
                    <div className="flex items-center gap-3">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Age Max:</span>
                      <span>{agemax}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-center gap-3 min-w-0">
                      <Home className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Address:</span>
                      <span className="truncate break-words">{address}</span>
                    </div>
                  )}
                  {country && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Country:</span>
                      <span>{country}</span>
                    </div>
                  )}
                  {city && (
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">City:</span>
                      <span>{city}</span>
                    </div>
                  )}
                </div>
                {otherRequirements && (
                  <div className="mt-8 md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-lg text-gray-900">Other Requirements</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-gray-700 whitespace-pre-line break-words">
                      {otherRequirements}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ExternalLink className="h-6 w-6 text-blue-500" />
                  Application Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Contact Email:</span>
                      <span>{contactEmail}</span>
                    </div>
                  )}
                  {contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Contact Phone:</span>
                      <span>{contactPhone}</span>
                    </div>
                  )}
                  {applicationMethod && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Application Method:</span>
                      <span>{applicationMethod}</span>
                    </div>
                  )}
                  {applicationUrl && (
                    <div className="flex items-center gap-3 min-w-0">
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Application URL:</span>
                      <a
                        href={applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                        style={{ wordBreak: "break-all" }}
                      >
                        {applicationUrl}
                      </a>
                    </div>
                  )}
                </div>
                {applicationInstructions && (
                  <div className="mt-8 md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <ListOrdered className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-lg text-gray-900">Application Instructions</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-gray-700 whitespace-pre-line break-words">
                      {applicationInstructions}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl rounded-2xl sticky top-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Existing Apply buttons */}
                  {applicationMethod === "Online" ? (
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleApplyOnline}
                      disabled={applyLoading}
                    >
                      {applyLoading ? "Applying..." : "Apply Online"}
                    </Button>
                  ) : applicationMethod === "Email" && contactEmail ? (
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleDraftEmail}
                    >
                      Draft Email
                    </Button>
                  ) : applicationUrl && (
                    <a href={applicationUrl} target="_blank" rel="noopener noreferrer" className="w-full group flex items-center justify-center bg-transparent border-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="bg-lime-400 px-6 py-4 flex items-center group-hover:bg-lime-300 transition-colors">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                      <div className="bg-black text-white px-8 py-4 font-semibold text-lg group-hover:bg-gray-800 transition-colors flex items-center flex-1 justify-center">
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </div>
                    </a>
                  )}
                  {/* TEST BUTTON: Always show "Apply with Email" for testing */}
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full rounded-xl bg-lime-100 text-lime-800 hover:bg-lime-200"
                    onClick={handleDraftEmail}
                  >
                    Draft Personalized Email
                  </Button>
                  {/* ...existing code for applyResult, Save for Later, deadline... */}
                  {applyResult && (
                    <div className="mt-4 text-sm bg-blue-50 border border-blue-200 rounded-xl p-4">
                      {applyResult.success === false ? (
                        <span className="text-red-700">
                          Error: {getApplyMessage(applyResult.code, applyResult.message)}
                        </span>
                      ) : (
                        <span>
                          Success: {getApplyMessage(applyResult.code, applyResult.message)}
                        </span>
                      )}
                    </div>
                  )}

                  {deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Application deadline: {deadline}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* Email Draft Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-10 relative border border-blue-200 max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-xl"
                onClick={handleCloseEmailPopup}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <Mail className="h-6 w-6" />
                Draft Email Application
              </h2>
              {!showDraftContent ? (
                <>
                  <p className="mb-6 text-gray-700">
                    Click the button below to generate a copyable email draft and download a mock resume.
                  </p>
                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 mb-4 text-lg py-3 rounded-xl"
                    onClick={handleOpenDraftEmail}
                  >
                    Open Draft Email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-lg py-3 rounded-xl"
                    onClick={handleCloseEmailPopup}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <div>
                        <label className="font-semibold text-gray-700">To:</label>
                        <div className="text-blue-700">{contactEmail ?? "example@email.com"}</div>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700">Subject:</label>
                        <div className="text-blue-700">Job Application: {job?.title ?? "Job Title"}</div>
                      </div>
                    </div>
                    <label className="font-semibold text-gray-700 mb-2 block">Body:</label>
                    <div className="relative">
                      {coverLetterLoading ? (
                        <div className="text-blue-600 mb-2">Generating cover letter...</div>
                      ) : coverLetterError ? (
                        <div className="text-red-600 mb-2">{coverLetterError}</div>
                      ) : (
                        <>
                          <textarea
                            className="w-full border border-blue-200 rounded-xl p-4 text-gray-800 min-h-[180px] max-h-[300px] resize-vertical focus:outline-blue-400 overflow-y-auto"
                            value={editableCoverLetter || `Dear ${company ?? "Hiring Manager"},\n\nI am interested in applying for the position of ${job?.title ?? "Job Title"}.\n\nPlease find my resume attached.\n\nRegards,\n[Your Name]`}
                            onChange={e => setEditableCoverLetter(e.target.value)}
                          />
                          <button
                            className="absolute top-4 right-4 bg-white border border-blue-200 rounded-lg px-2 py-1 flex items-center gap-1 text-blue-700 hover:bg-blue-100 transition"
                            onClick={() => {
                              navigator.clipboard.writeText(editableCoverLetter);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 1500);
                            }}
                            disabled={!editableCoverLetter}
                          >
                            <Copy className="h-4 w-4" />
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-lime-600 text-white hover:bg-lime-700 mb-4 text-lg py-3 rounded-xl"
                    onClick={downloadMockResume}
                  >
                    Download Mock Resume
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-lg py-3 rounded-xl"
                    onClick={handleCloseEmailPopup}
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function extractAgentMessage(details: string) {
  if (!details) return "";
  // Try to extract MESSAGE: ... from anywhere in the string (greedy)
  const messageMatches = [...details.matchAll(/MESSAGE:\s*([^\n]+)/g)];
  if (messageMatches.length > 0) {
    // Return the last MESSAGE found (most relevant)
    return messageMatches[messageMatches.length - 1][1].trim();
  }
  // Fallback: extract 'extracted_content' value if present
  const extractedMatch = details.match(/extracted_content='([^']+)'/);
  if (extractedMatch && extractedMatch[1]) {
    // Try to extract MESSAGE from extracted_content
    const innerMessageMatch = extractedMatch[1].match(/MESSAGE:\s*([^\n]+)/);
    if (innerMessageMatch && innerMessageMatch[1]) return innerMessageMatch[1].trim();
    return extractedMatch[1];
  }
  // Fallback: return the whole details string
  return details;
}

function getApplyMessage(code: string, message: string) {
  switch (code) {
    case "SUCCESS":
      return "Your application was submitted successfully!";
    case "FORM_EXPIRED":
      return "This job application form is expired or no longer accepting responses.";
    case "FORM_PRIVATE":
      return "This form requires sign-in or has a CAPTCHA. Please download and run NextSira locally to apply for this job.";
    case "CAPTCHA":
      return "This form has a CAPTCHA and cannot be submitted automatically. Please download and run NextSira locally to apply for this job.";
    case "UNKNOWN":
      return "An unknown error occurred. Please try again later.";
    default:
      return message || "An error occurred while applying.";
  }
}

// Add this helper for the downloadable mock resume
function downloadMockResume() {
  const resumeContent = `
    John Doe
    johndoe@email.com
    +1 234 567 8901

    Objective:
    Seeking the position of ${job?.title ?? "Job Title"} at ${job?.company ?? "Company"}.

    Education:
    Bachelor of Science in Computer Science, Example University

    Experience:
    - Software Engineer at ExampleCorp (2022-2024)
    - Intern at DemoTech (2021)

    Skills:
    ${Array.isArray(job?.skills) ? job.skills.join(", ") : "Skill1, Skill2"}

    References available upon request.
  `;
  const blob = new Blob([resumeContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Mock_Resume.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
