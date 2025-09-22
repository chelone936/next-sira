"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/api"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      // Use has_profile from localStorage to decide redirect
      const hasProfile = typeof window !== "undefined" ? localStorage.getItem("has_profile") === "true" : false;
      window.location.href = hasProfile ? "/home" : "/onboarding";
    }
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
        <Link href="/signup">
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            Sign up
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your NextSira account to continue your job search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black font-medium py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
