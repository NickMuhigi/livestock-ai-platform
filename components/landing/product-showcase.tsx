"use client"

import { TrendingUp, Users, Zap } from "lucide-react"

export function ProductShowcase() {
  return (
    <section id="stats" className="py-24 lg:py-32 relative scroll-mt-28">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-showcase" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-showcase)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Large stat cards - Creative layout */}
        <div className="mb-24">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">Stats</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground animate-fade-in-up">
              Already trusted by farms
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Stat 1 */}
            <div className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-10 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="text-5xl md:text-6xl font-black text-primary mb-2">50K+</div>
                <p className="text-sm text-muted-foreground">Images analyzed daily</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="group relative rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-10 overflow-hidden transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-3 mb-6">
                  <Users className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-5xl md:text-6xl font-black text-emerald-500 mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Active farms</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="group relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-10 overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-cyan-500/10 p-3 mb-6">
                  <Zap className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="text-5xl md:text-6xl font-black text-cyan-500 mb-2">20+</div>
                <p className="text-sm text-muted-foreground">Disease types detected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vet Integration - Creative card */}
        <div className="group relative rounded-3xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-12 overflow-hidden transition-all duration-300 hover:border-primary/30 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left side - visual */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-transparent p-8 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <p className="text-muted-foreground text-sm">Expert veterinarians</p>
                <p className="text-2xl font-bold text-foreground mt-2">Available 24/7</p>
              </div>
            </div>

            {/* Right side - content */}
            <div>
              <h3 className="text-3xl font-black text-foreground mb-4">Professional vet support</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Connect directly with qualified veterinarians for expert consultation. Share health records instantly and get treatment recommendations tailored to your herd.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-sm font-bold mt-0.5">✓</span>
                  <span className="text-sm text-foreground">Instant expert consultations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-sm font-bold mt-0.5">✓</span>
                  <span className="text-sm text-foreground">Share health records securely</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-sm font-bold mt-0.5">✓</span>
                  <span className="text-sm text-foreground">Track treatments and recovery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

