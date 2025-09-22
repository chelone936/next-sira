"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { register, login } from "@/lib/api"
import { Search, Users } from "lucide-react"

export default function SignUpPage() {
  const [userType, setUserType] = useState<"recruiter" | "jobseeker" | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    experience: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    const res = await register({
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    })
    if (res.error) {
      setLoading(false)
      setError(res.error)
      return
    }
    // Automatically log in after registration
    const loginRes = await login(formData.email, formData.password)
    setLoading(false)
    if (loginRes.error) {
      setError(loginRes.error)
    } else {
      // Redirect based on user type
      if (userType === "recruiter") {
        window.location.href = "/recruiter/onboarding/"
      } else {
        window.location.href = "/onboarding"
      }
    }
  }

  const handleUserTypeSelection = (type: "recruiter" | "jobseeker") => {
    setUserType(type)
    setShowForm(true)
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
                 linear-gradient(to bottom, rgb(147 197 253 / 0.1) 1px, transparent 0)
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
        <Link href="/signin">
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            Sign in
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Join NextSira</CardTitle>
            <CardDescription className="text-gray-600">
              {!showForm
                ? "Choose how you'd like to use NextSira"
                : "Create your account and let AI find your perfect job match"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForm ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">I'm here to...</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Seeker Option */}
                  <button
                    onClick={() => handleUserTypeSelection("jobseeker")}
                    className="group relative p-8 rounded-2xl border-2 border-blue-200/50 bg-blue-50/30 hover:bg-blue-50/50 hover:border-blue-300/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                        <Search className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Find a Job</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Discover opportunities that match your skills and career goals
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>

                  {/* Recruiter Option */}
                  <button
                    onClick={() => handleUserTypeSelection("recruiter")}
                    className="group relative p-8 rounded-2xl border-2 border-emerald-200/50 bg-emerald-50/30 hover:bg-emerald-50/50 hover:border-emerald-300/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-300">
                        <Users className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Hire Talent</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Find and connect with top candidates for your team
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-600 text-sm">{error}</div>}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 p-0 h-auto font-normal"
                >
                  ← Back to selection
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black font-medium py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
