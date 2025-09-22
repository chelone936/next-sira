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
import { Upload, FileText, MapPin, Target, Briefcase, DollarSign, X } from "lucide-react"
import { apiRequest } from "@/lib/api"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    location: "",
    preferredLocations: "",
    salaryRange: "",
    jobTypes: "",
    skills: [] as string[],
    bio: "",
    resume: null as File | null,
    linkedinUrl: "",
    portfolioUrl: "",
    availability: "",
  })
  const [skillInput, setSkillInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }))
    }
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

    // Prepare FormData for file upload and other fields
    const data = new FormData()
    data.append("location", formData.location)
    data.append("preferredLocations", formData.preferredLocations)
    data.append("salaryRange", formData.salaryRange)
    data.append("jobTypes", formData.jobTypes)
    data.append("bio", formData.bio)
    data.append("linkedinUrl", formData.linkedinUrl)
    data.append("portfolioUrl", formData.portfolioUrl)
    data.append("availability", formData.availability)
    if (formData.resume) {
      data.append("resume", formData.resume)
    }
    data.append("skills", JSON.stringify(formData.skills))

    // Send onboarding data to backend
    const res = await apiRequest(
      "api/user/onboarding/",
      "POST",
      data,
      { auth: true }
    )

    if (res.error) {
      setLoading(false)
      setError(res.error)
      return
    }

    // After onboarding, trigger job matching
    const matchRes = await apiRequest("api/jobs/match_all/", "POST", undefined, { auth: true })

    setLoading(false)
    if (matchRes && matchRes.created_or_updated) {
      // Redirect to home after matching
      router.push("/home")
    } else {
      setError("Failed to match jobs after onboarding.")
    }
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

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Grid Lines */}
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

        {/* Dots Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Large Circles */}
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
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Upload your resume"}
              {currentStep === 3 && "Job preferences"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 1 && "Help us understand your background and goals"}
              {currentStep === 2 && "Let our AI analyze your experience and skills"}
              {currentStep === 3 && "Set your job search preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={e => {
                if (currentStep < 3) {
                  e.preventDefault()
                  handleNext()
                } else {
                  handleSubmit(e)
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && currentStep < 3) {
                  e.preventDefault()
                  handleNext()
                }
              }}
            >
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Current Location
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Addis Ababa"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                      Professional Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about your professional background, key achievements, and career goals..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                      Key Skills
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-700">
                        LinkedIn URL
                      </Label>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolioUrl" className="text-sm font-medium text-gray-700">
                        Portfolio URL
                      </Label>
                      <Input
                        id="portfolioUrl"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolioUrl}
                        onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Resume Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Upload Resume
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer" tabIndex={-1}>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        {formData.resume ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formData.resume.name}</p>
                            <p className="text-xs text-gray-500">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-900">Click to upload your resume</p>
                            <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Our AI will analyze your resume for skills and experience</li>
                      <li>• We'll suggest improvements to optimize for ATS systems</li>
                      <li>• Your profile will be matched with relevant job opportunities</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Job Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="preferredLocations"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Preferred Job Locations
                    </Label>
                    <Input
                      id="preferredLocations"
                      type="text"
                      placeholder="San Francisco, New York, Remote"
                      value={formData.preferredLocations}
                      onChange={(e) => handleInputChange("preferredLocations", e.target.value)}
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTypes" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Job Types
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("jobTypes", value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select preferred job types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryRange" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Expected Salary Range
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("salaryRange", value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select salary range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                        <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                        <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                        <SelectItem value="150k-200k">$150,000 - $200,000</SelectItem>
                        <SelectItem value="200k+">$200,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-sm font-medium text-gray-700">
                      Availability
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("availability", value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="When can you start?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">Immediately</SelectItem>
                        <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                        <SelectItem value="1-month">1 month</SelectItem>
                        <SelectItem value="2-months">2 months</SelectItem>
                        <SelectItem value="3-months">3+ months</SelectItem>
                      </SelectContent>
                    </Select>
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
                    {loading ? "Saving..." : "Complete Setup"}
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
