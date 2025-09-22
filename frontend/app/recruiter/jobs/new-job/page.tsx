"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Briefcase, DollarSign, X, Tag, CalendarDays, User, Globe2, Link2 } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

const JOB_TYPE_OPTIONS = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Temporary", label: "Temporary" },
]

const DEGREE_OPTIONS = [
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "Diploma", label: "Diploma" },
  { value: "PhD", label: "PhD" },
  { value: "Other", label: "Other" },
]

const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "Entry", label: "Entry" },
  { value: "Mid", label: "Mid" },
  { value: "Senior", label: "Senior" },
  { value: "Director", label: "Director" },
  { value: "Intern", label: "Intern" },
]

const APPLICATION_METHOD_OPTIONS = [
  { value: "Online", label: "Online" },
  { value: "In-person", label: "In-person" },
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
]

export default function CreateJobPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    country: "",
    city: "",
    address: "",
    salary_min: "",
    salary_max: "",
    deadline: "",
    job_type: "",
    category: "",
    experience_level: "",
    degree_required: "",
    cgpa: "",
    contact_email: "",
    contact_phone: "",
    number_of_positions: "",
    skills: [] as string[],
    tags: [] as string[],
    application_instructions: "",
  })
  const [skillInput, setSkillInput] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = () => {
    const skill = skillInput.trim()
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Prepare payload
    const payload = { ...formData }
    payload.skills = formData.skills
    payload.tags = formData.tags
    payload.posted_date = format(new Date(), "MMMM dd, yyyy") // Set posted_date to current date

    const res = await apiRequest(
      "api/jobs/recruiter/jobs/create/",
      "POST",
      payload,
      { auth: true }
    )

    setLoading(false)
    if (res.error) {
      setError(res.error)
      return
    }
    router.push("/recruiter/jobs")
  }

  // Update deadline in formData when calendar changes
  const handleDeadlineChange = (date: Date | undefined) => {
    setDeadlineDate(date || null)
    handleInputChange("deadline", date ? format(date, "MMMM dd, yyyy") : "")
  }

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-blue-100/20"
          style={{
            backgroundImage: `
                 linear-gradient(to right, rgb(147 197 253 / 0.1) 1px, transparent 1px),
                 linear-gradient(to bottom, rgb(147 197 253 / 0.1) 1px, transparent 1px)
               `,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full border border-blue-200/30" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full border border-blue-200/30" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full border border-blue-200/30" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full border border-blue-200/30" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-xl font-semibold text-gray-900">NextSira</span>
        </Link>
        <div className="text-sm text-gray-600">Step {currentStep} of 3</div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStep === 1 && "Job Details"}
              {currentStep === 2 && "Requirements & Application"}
              {currentStep === 3 && "Additional Info"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 1 && "Fill in the basic details about the job opening."}
              {currentStep === 2 && "Specify requirements and how candidates should apply."}
              {currentStep === 3 && "Add tags, posting date, and finalize your job post."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              onKeyDown={e => {
                // Prevent Enter from submitting the form unless on step 3
                if (e.key === "Enter" && currentStep < 3) {
                  e.preventDefault();
                }
              }}
            >
              {/* Step 1: Job Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Job Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe2 className="w-4 h-4" />
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="e.g. NextSira Technologies"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Job Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the responsibilities, expectations, and role..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="e.g. Addis Ababa"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                        Country
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="e.g. Ethiopia"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="e.g. Addis Ababa"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Address
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="e.g. Bole Road, Building 5"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary_min" className="text-sm font-medium text-gray-700">
                        Min Salary (ETB)
                      </Label>
                      <Input
                        id="salary_min"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 15000"
                        value={formData.salary_min}
                        onChange={(e) => handleInputChange("salary_min", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        suffix="ETB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary_max" className="text-sm font-medium text-gray-700">
                        Max Salary (ETB)
                      </Label>
                      <Input
                        id="salary_max"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 25000"
                        value={formData.salary_max}
                        onChange={(e) => handleInputChange("salary_max", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        suffix="ETB"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Application Deadline
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {deadlineDate
                            ? format(deadlineDate, "MMMM dd, yyyy")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deadlineDate || undefined}
                          onSelect={handleDeadlineChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category
                    </Label>
                    <Input
                      id="category"
                      type="text"
                      placeholder="e.g. IT, Engineering"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Requirements & Application */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience_level" className="text-sm font-medium text-gray-700">
                        Experience Level
                      </Label>
                      <Select
                        value={formData.experience_level}
                        onValueChange={(value) => handleInputChange("experience_level", value)}
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_LEVEL_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree_required" className="text-sm font-medium text-gray-700">
                        Degree Required
                      </Label>
                      <Select
                        value={formData.degree_required}
                        onValueChange={(value) => handleInputChange("degree_required", value)}
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEGREE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cgpa" className="text-sm font-medium text-gray-700">
                        Minimum CGPA
                      </Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        placeholder="e.g. 3.0"
                        value={formData.cgpa}
                        onChange={(e) => handleInputChange("cgpa", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number_of_positions" className="text-sm font-medium text-gray-700">
                        Number of Positions
                      </Label>
                      <Input
                        id="number_of_positions"
                        type="number"
                        min="1"
                        placeholder="e.g. 3"
                        value={formData.number_of_positions}
                        onChange={(e) => handleInputChange("number_of_positions", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="text-sm font-medium text-gray-700">
                      Contact Email
                    </Label>
                    <Input
                      id="contact_email"
                      type="email"
                      placeholder="e.g. hr@company.com"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange("contact_email", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="text-sm font-medium text-gray-700">
                      Contact Phone
                    </Label>
                    <Input
                      id="contact_phone"
                      type="text"
                      placeholder="e.g. +251912345678"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job_type" className="text-sm font-medium text-gray-700">
                      Job Type
                    </Label>
                    <Select
                      value={formData.job_type}
                      onValueChange={(value) => handleInputChange("job_type", value)}
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                      Required Skills
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="skills"
                        type="text"
                        placeholder="e.g. React"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddSkill()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-2"
                        disabled={!skillInput.trim()}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 text-blue-500 hover:text-red-500"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        type="text"
                        placeholder="e.g. remote, urgent"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2"
                        disabled={!tagInput.trim()}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-green-500 hover:text-red-500"
                            aria-label={`Remove ${tag}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="application_instructions" className="text-sm font-medium text-gray-700">
                      Application Instructions
                    </Label>
                    <Textarea
                      id="application_instructions"
                      placeholder="Any special instructions for applicants?"
                      value={formData.application_instructions || ""}
                      onChange={(e) => handleInputChange("application_instructions", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="bg-white/80 backdrop-blur-sm"
                  >
                    Previous
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black font-medium py-2.5 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="ml-auto bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black font-medium py-2.5 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    {loading ? "Creating..." : "Create Job"}
                  </Button>
                )}
              </div>
              {error && (
                <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
