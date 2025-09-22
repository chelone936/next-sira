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

export default function RecruiterOnboardingPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    position: "",
    contactEmail: "",
    bio: "",
    linkedinUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const data = new FormData()
    data.append("company_name", formData.companyName)
    data.append("company_website", formData.companyWebsite)
    data.append("position", formData.position)
    data.append("contact_email", formData.contactEmail)
    data.append("bio", formData.bio)
    data.append("linkedin_url", formData.linkedinUrl)

    const res = await apiRequest(
      "api/user/recruiter_onboarding/",
      "POST",
      data,
      { auth: true }
    )

    setLoading(false)
    if (res.error) {
      setError(res.error)
      return
    }
    router.push("/recruiter/")
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
        <div className="text-sm text-gray-600">Recruiter Onboarding</div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Recruiter Onboarding
            </CardTitle>
            <CardDescription className="text-gray-600">
              Tell us about your company and yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={e => handleInputChange("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={e => handleInputChange("companyWebsite", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Your Position</Label>
                  <Input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={e => handleInputChange("position", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={e => handleInputChange("contactEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={e => handleInputChange("bio", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={e => handleInputChange("linkedinUrl", e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-8 w-full bg-gradient-to-r from-lime-400 to-lime-500 text-black font-medium py-2.5 px-6 rounded-lg"
              >
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
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
