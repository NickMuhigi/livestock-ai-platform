"use client"

import Link from "next/link"
import Image from "next/image"
import { Upload, BarChart3, MessageSquare, CalendarCheck } from "lucide-react"

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 lg:py-32 relative scroll-mt-28">
      {/* Background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-dashboard" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dashboard)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Dashboard
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Your personal livestock management dashboard
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Powerful tools built for modern farmers. Upload, analyze, track, and get expert support all in one place.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50 animate-fade-in-up mb-12" style={{animationDelay: '0.1s'}}>
          <div className="flex min-h-[600px] bg-card">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 flex-col border-r border-border/50 bg-card/50 p-5">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 mb-8 pb-6 border-b border-border/50">
                <Image
                  src="/Herd-AI Logo.png"
                  alt="Herd AI Logo"
                  width={80}
                  height={80}
                />
              </Link>

              {/* Nav Items */}
              <nav className="flex-1 space-y-1">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-primary/10 text-primary">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50">
                  <BarChart3 className="h-4 w-4" />
                  <span>Results</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50">
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Assistant</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50">
                  <CalendarCheck className="h-4 w-4" />
                  <span>Booking</span>
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 flex flex-col">
              {/* Header */}
              <div className="mb-8 pb-6 border-b border-border/50">
                <h3 className="text-2xl font-bold text-foreground mb-1">Upload Livestock Image</h3>
                <p className="text-sm text-muted-foreground">Upload an image of your livestock to get AI-powered health analysis</p>
              </div>

              {/* Upload Area */}
              <div className="flex-1 border-2 border-dashed border-border/50 border-primary/30 rounded-xl bg-gradient-to-br from-primary/5 to-transparent flex flex-col items-center justify-center gap-4 mb-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground mb-1">Drag and drop your image</p>
                  <p className="text-sm text-muted-foreground">or click to browse your device</p>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-card/50 border border-border/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Supported formats</p>
                  <p className="text-sm text-foreground">JPG, PNG, WebP</p>
                </div>
                <div className="rounded-lg bg-card/50 border border-border/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Max file size</p>
                  <p className="text-sm text-foreground">10 MB</p>
                </div>
                <div className="rounded-lg bg-card/50 border border-border/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Analysis time</p>
                  <p className="text-sm text-foreground">Under 2 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 animate-fade-in-up">Dashboard Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload & Analyze */}
            <div className="rounded-2xl border border-border/50 p-8 bg-gradient-to-br from-primary/5 to-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Upload & Analyze</h4>
              <p className="text-sm text-muted-foreground">Upload images of your livestock instantly. Get AI-powered disease detection and health analysis in seconds.</p>
            </div>

            {/* Results */}
            <div className="rounded-2xl border border-border/50 p-8 bg-gradient-to-br from-emerald-500/5 to-transparent transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-3 mb-4">
                <BarChart3 className="h-6 w-6 text-emerald-500" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">View Results</h4>
              <p className="text-sm text-muted-foreground">Access all your analysis results, health reports, and insights from previous uploads in one organized view.</p>
            </div>

            {/* AI Assistant */}
            <div className="rounded-2xl border border-border/50 p-8 bg-gradient-to-br from-cyan-500/5 to-transparent transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="inline-flex items-center justify-center rounded-xl bg-cyan-500/10 p-3 mb-4">
                <MessageSquare className="h-6 w-6 text-cyan-500" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">AI Assistant</h4>
              <p className="text-sm text-muted-foreground">Chat with our AI about your livestock health, get treatment recommendations, and ask all your questions.</p>
            </div>

            {/* Vet Booking */}
            <div className="rounded-2xl border border-border/50 p-8 bg-gradient-to-br from-orange-500/5 to-transparent transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <div className="inline-flex items-center justify-center rounded-xl bg-orange-500/10 p-3 mb-4">
                <CalendarCheck className="h-6 w-6 text-orange-500" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Book Vet Consultation</h4>
              <p className="text-sm text-muted-foreground">Schedule appointments with professional veterinarians for expert consultations and treatment guidance.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
