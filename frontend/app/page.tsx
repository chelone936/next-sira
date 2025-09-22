"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Search,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  MapPin,
  Building2,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Globe,
  Award,
} from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-400/15 to-yellow-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #1e293b 1px, transparent 1px),
                linear-gradient(-45deg, #1e293b 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rotate-45 animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-teal-400/30 rotate-45 animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-orange-400/30 rounded-full animate-bounce delay-500"></div>

        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/5 to-white/20"></div>
      </div>

      {/* Header - unchanged */}
      <header className="relative z-10 px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">NextSira</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              For Companies
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              For Candidates
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Resources
            </a>
          </div>

          <Link href="/signin">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              Sign in
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section - unchanged */}
      <main className="relative z-10 px-4 sm:px-6 pt-8 sm:pt-16 pb-8">
        {/* Grid Lines Background from onboarding */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-blue-100/20 pointer-events-none"
          style={{
            backgroundImage: `
                 linear-gradient(to right, rgb(147 197 253 / 0.1) 1px, transparent 1px),
                 linear-gradient(to bottom, rgb(147 197 253 / 0.1) 1px, transparent 1px)
               `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                <Zap className="w-4 h-4 mr-2" />
                2,847 new jobs scraped today
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance">
                Find perfect jobs
                <br />
                with{" "}
                <span className="font-cursive italic" style={{ color: "oklch(0.85 0.2 120)" }}>
                  AI matching
                </span>
              </h1>

              <div className="space-y-4">
                <p className="text-lg sm:text-xl text-gray-700 text-pretty">
                  AI-powered job matching, automated applications, and career insights.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search jobs by title, company, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 bg-transparent"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Search Jobs
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Join 50,000+ professionals who found their dream jobs with AI</p>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-lime-500">50K+</div>
                  <div className="text-sm text-green-700">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-lime-500">94%</div>
                  <div className="text-sm text-green-700">Match Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-lime-500">2.3M</div>
                  <div className="text-sm text-green-700">Jobs Applied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-lime-500">4.9★</div>
                  <div className="text-sm text-green-700">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image Area */}
            <div className="relative">
              <img
                src="/image.png"
                alt="Job Search Illustration"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </main>

      <section className="relative z-10 px-4 sm:px-6 py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-blue-100">
              <Award className="w-4 h-4 mr-2" />
              Trusted by 50,000+ professionals
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 text-balance">
              Success stories from our community
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-3 text-lg text-gray-600 font-medium">4.9/5 from 12,000+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-8 leading-relaxed text-lg">
                "NextSira's AI found me my dream remote position at Google in just 2 weeks. The matching accuracy was
                incredible - every job suggestion was perfectly aligned with my skills and career goals."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  S
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Sarah Chen</div>
                  <div className="text-gray-600">Senior Software Engineer</div>
                  <div className="text-sm text-blue-600 font-medium">Google • Remote</div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-8 leading-relaxed text-lg">
                "The auto-apply feature is a game-changer! It saved me 20+ hours per week and landed me 5 interviews in
                my first month. The personalized applications were spot-on."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  M
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Marcus Johnson</div>
                  <div className="text-gray-600">Product Manager</div>
                  <div className="text-sm text-green-600 font-medium">Stripe • Hybrid</div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-8 leading-relaxed text-lg">
                "Increased my salary by 40% thanks to the AI-powered negotiation insights and market data. The career
                guidance was invaluable for my transition to a senior role."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  A
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Aisha Patel</div>
                  <div className="text-gray-600">Senior Data Scientist</div>
                  <div className="text-sm text-purple-600 font-medium">Netflix • Remote</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 py-32 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-indigo-100">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Job Search Platform
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 text-balance">
              Your AI-powered career companion
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed">
              Let artificial intelligence handle the heavy lifting while you focus on landing your dream job, whether
              remote or on-site
            </p>
          </div>

          {/* Smart Job Matching */}
          <div className="mb-32">
            <div className="bg-white rounded-4xl p-12 sm:p-16 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-700 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-balance">
                      Smart Job Matching
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-xl">
                      Our advanced AI analyzes your skills, experience, and preferences to find jobs that perfectly
                      match your profile with 94% accuracy. Whether you're seeking remote opportunities, hybrid roles,
                      or traditional office positions, we find the perfect fit for your career goals.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="flex items-center gap-3 text-blue-600 font-semibold bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
                        <CheckCircle className="w-5 h-5" />
                        1,247+ jobs matched daily
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Globe className="w-5 h-5" />
                        Remote & global opportunities
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                    <div className="text-gray-500 text-xl font-medium">AI Matching Visualization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Apply Agents */}
          <div className="mb-32">
            <div className="bg-white rounded-4xl p-12 sm:p-16 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-700 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1 w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                    <div className="text-gray-500 text-xl font-medium">Auto-Apply Dashboard</div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-balance">
                      Auto-Apply Agents
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-xl">
                      Deploy intelligent AI agents that work around the clock, applying to relevant positions with
                      personalized applications. Perfect for remote job hunting and traditional roles alike, each
                      application is customized with your unique experience and achievements.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="flex items-center gap-3 text-green-600 font-semibold bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
                        <CheckCircle className="w-5 h-5" />
                        89 applications sent this week
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-5 h-5" />
                        Works 24/7 globally
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Enhancement */}
          <div className="mb-32">
            <div className="bg-white rounded-4xl p-12 sm:p-16 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-700 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-balance">
                      AI Resume Optimizer
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-xl">
                      Automatically tailor your resume for each job application, highlighting relevant skills and
                      optimizing for ATS systems. Especially effective for remote job applications where standing out in
                      digital screening processes is crucial for success.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="flex items-center gap-3 text-purple-600 font-semibold bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100">
                        <CheckCircle className="w-5 h-5" />
                        87% higher response rate
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <TrendingUp className="w-5 h-5" />
                        ATS & remote-optimized
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                    <div className="text-gray-500 text-xl font-medium">Resume Optimization Preview</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Preparation */}
          <div className="mb-32">
            <div className="bg-white rounded-4xl p-12 sm:p-16 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-700 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1 w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                    <div className="text-gray-500 text-xl font-medium">Interview Practice Interface</div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-balance">
                      Interview Preparation
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-xl">
                      Get personalized interview questions, practice sessions, and real-time feedback based on the
                      specific role and company culture. Includes specialized preparation for remote interview formats,
                      video call etiquette, and virtual presentation skills.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="flex items-center gap-3 text-orange-600 font-semibold bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
                        <CheckCircle className="w-5 h-5" />
                        23 interviews scheduled
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Globe className="w-5 h-5" />
                        Remote & on-site prep
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Intelligence */}
          <div className="mb-32">
            <div className="bg-white rounded-4xl p-12 sm:p-16 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-700 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-balance">
                      Salary Intelligence
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-xl">
                      AI-powered salary insights and negotiation strategies based on real market data and your specific
                      experience level. Includes comprehensive remote work compensation analysis, location-based
                      adjustments, and global salary benchmarking.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="flex items-center gap-3 text-teal-600 font-semibold bg-teal-50 px-6 py-3 rounded-2xl border border-teal-100">
                        <CheckCircle className="w-5 h-5" />
                        Average 23% salary increase
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Globe className="w-5 h-5" />
                        Global market data
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                    <div className="text-gray-500 text-xl font-medium">Salary Analytics Dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Path Analysis */}
          <div className="mb-20">
            <div className="bg-white rounded-4xl p-12 sm:p-16 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-700 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1 w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                    <div className="text-gray-500 text-xl font-medium">Career Path Visualization</div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-balance">
                      Career Path Analysis
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed text-xl">
                      Discover skill gaps, growth opportunities, and career trajectories with AI-driven insights from
                      millions of career paths. Includes specialized guidance for remote work career progression,
                      digital nomad opportunities, and hybrid work transitions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="flex items-center gap-3 text-indigo-600 font-semibold bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
                        <CheckCircle className="w-5 h-5" />5 skill recommendations
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Globe className="w-5 h-5" />
                        Remote career paths
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-4xl p-12 sm:p-20 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-green-500/30">
                  <Clock className="w-4 h-4 mr-2" />
                  Limited time: 50% off first month
                </div>
                <h3 className="text-4xl sm:text-5xl font-bold mb-8 text-balance">
                  Ready to supercharge your job search?
                </h3>
                <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed text-pretty">
                  Join thousands of professionals who've found their dream jobs with AI-powered assistance
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button className="group flex items-center bg-transparent border-0 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                    <div className="bg-lime-400 px-6 sm:px-8 py-5 sm:py-6 flex items-center group-hover:bg-lime-300 transition-colors">
                      <div className="w-5 h-5 bg-black rounded-full"></div>
                    </div>
                    <div className="bg-white text-black px-10 sm:px-12 py-5 sm:py-6 font-bold text-lg sm:text-xl group-hover:bg-gray-100 transition-colors">
                      Start free trial
                    </div>
                  </button>
                  <div className="text-gray-400">No credit card required • 14-day free trial</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 py-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-indigo-200">
              <Building2 className="w-4 h-4 mr-2" />
              For Hiring Teams
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 text-balance">
              Find exceptional talent faster
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto text-pretty leading-relaxed">
              AI-powered talent matching and automated screening to connect you with the perfect candidates, including
              top remote professionals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-balance">
                AI-Powered Candidate Matching
              </h3>
              <p className="text-gray-600 mb-10 leading-relaxed text-xl">
                Our advanced AI analyzes candidate profiles, skills, and experience to match them with your job
                requirements with unprecedented precision. Access qualified remote workers and on-site talent from our
                global network of pre-screened professionals.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg font-medium">95% candidate-job fit accuracy</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg font-medium">50% faster hiring process</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg font-medium">Access to global remote talent pool</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg font-medium">Automated candidate screening & ranking</span>
                </div>
              </div>
            </div>
            <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-2xl">
              <div className="text-gray-500 text-xl font-medium">Recruiter Dashboard Preview</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Global Talent Pool</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access our curated database of 50,000+ pre-screened candidates including remote specialists and global
                talent
              </p>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-sm text-gray-500 font-medium">Active candidates worldwide</div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Faster Hiring</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dramatically reduce your average time to hire with AI-powered screening, matching, and automated
                workflows
              </p>
              <div className="text-3xl font-bold text-green-600 mb-2">12 Days</div>
              <div className="text-sm text-gray-500 font-medium">Average time to hire</div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Success Rate</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Higher success rate with AI-matched candidates, comprehensive screening, and predictive analytics
              </p>
              <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
              <div className="text-sm text-gray-500 font-medium">Successful placements</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-4xl p-12 sm:p-16 shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-balance">
                  Ready to transform your hiring process?
                </h3>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Join hundreds of companies using NextSira to find top talent faster, more efficiently, and with better
                  outcomes
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Schedule Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-10 py-6 text-xl font-semibold rounded-2xl bg-transparent border-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
                <p className="text-gray-500 mt-6 text-lg">
                  Free consultation • Custom pricing available • No setup fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-green-100">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise-Grade Security
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-balance">
              Your data is secure with us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We maintain the highest security standards to protect your personal and professional information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bank-Level Security</h3>
              <p className="text-gray-600 leading-relaxed">
                256-bit SSL encryption protects all your data with military-grade security protocols
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">GDPR Compliant</h3>
              <p className="text-gray-600 leading-relaxed">
                Full compliance with global data protection regulations and privacy laws
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">SOC 2 Certified</h3>
              <p className="text-gray-600 leading-relaxed">
                Independently audited security controls and compliance frameworks
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 py-32 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-gray-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Got Questions?
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 text-balance">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600 text-pretty max-w-3xl mx-auto">
              Everything you need to know about NextSira and how our AI-powered platform works
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors">
                How does AI job matching work?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our AI analyzes your resume, skills, experience, and preferences to match you with relevant job
                opportunities. It considers factors like job requirements, company culture, salary expectations, remote
                work preferences, and career goals to provide highly accurate matches with a 94% success rate.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 hover:shadow-xl hover:border-green-200 transition-all duration-300 group">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors">
                Are AI agents safe to use for job applications?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Yes, our AI agents are completely safe and ethical. They customize each application using your authentic
                information and never misrepresent your qualifications. You maintain full control and can review all
                applications before they're sent. The agents simply automate the repetitive parts of job searching while
                maintaining your professional integrity.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300 group">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 group-hover:text-purple-600 transition-colors">
                How much does NextSira cost?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                We offer a free tier that includes basic job matching and limited AI agent usage. Our premium plans
                start at $29/month and include unlimited AI applications, advanced resume optimization, interview
                preparation, salary insights, and priority support. Enterprise plans are available for teams and
                organizations with custom pricing.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 group-hover:text-orange-600 transition-colors">
                Can I control which jobs the AI applies to?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Absolutely. You set all the parameters including job types, salary ranges, company sizes, locations,
                remote work preferences, and specific requirements. The AI only applies to jobs that match your
                criteria, and you can pause, modify, or stop the agents at any time. You're always in complete control
                of your job search strategy.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 hover:shadow-xl hover:border-teal-200 transition-all duration-300 group">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 group-hover:text-teal-600 transition-colors">
                How quickly will I see results?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Most users see their first job matches within 24 hours of setting up their profile. AI agents typically
                start applying to relevant positions within 48 hours. Interview requests usually come within the first
                week, though this varies by industry, experience level, and market conditions.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors">
                What makes NextSira different from other job sites?
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Unlike traditional job boards, NextSira actively works for you 24/7. Instead of manually searching and
                applying to jobs, our AI handles the entire process while you focus on interview preparation and skill
                development. We're the only platform that combines intelligent matching, automated applications,
                comprehensive career support, and global remote job access in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <div className="px-4 sm:px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-gray-900 rounded-md"></div>
                  </div>
                  <span className="text-3xl font-bold">NextSira</span>
                </div>
                <p className="text-gray-300 text-xl leading-relaxed mb-10 max-w-md">
                  The AI-powered job search platform that finds perfect opportunities and applies for you automatically,
                  including remote positions worldwide.
                </p>
                <div className="flex items-center">
                  <button className="group flex items-center bg-transparent border-0 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                    <div className="bg-lime-400 px-6 py-4 flex items-center group-hover:bg-lime-300 transition-colors">
                      <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                    <div className="bg-white text-black px-8 py-4 font-bold text-lg group-hover:bg-gray-100 transition-colors">
                      Start free trial
                    </div>
                  </button>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-xl font-bold mb-8 text-white">Product</h3>
                <ul className="space-y-5">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      AI Job Matching
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Auto-Apply Agents
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Resume Optimizer
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Interview Prep
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Salary Insights
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-xl font-bold mb-8 text-white">Company</h3>
                <ul className="space-y-5">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Press
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-xl font-bold mb-8 text-white">Support</h3>
                <ul className="space-y-5">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Status Page
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-lg">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-700 mt-20 pt-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-gray-400 mb-6 md:mb-0 text-lg">© 2024 NextSira. All rights reserved.</div>
                <div className="flex items-center space-x-10">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
