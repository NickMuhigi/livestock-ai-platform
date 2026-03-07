"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full mix-blend-screen filter blur-3xl animate-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full mix-blend-screen filter blur-3xl animate-glow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
        {/* Main Headline - Creative Typography */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-foreground mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Your livestock's <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">health guardian</span>
        </h1>

        {/* Subtitle with creative styling */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Detect diseases in seconds, not days. AI-powered analysis that saves farms thousands while keeping herds healthy and thriving.
        </p>

        {/* CTA Buttons with creative styling */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Start detecting free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-primary/5"
          >
            Watch demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats bar - Creative horizontal layout */}
        <div className="grid grid-cols-3 gap-8 pb-12 border-b border-border/50 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div>
            <div className="text-3xl font-black text-primary mb-1">95%</div>
            <p className="text-sm text-muted-foreground">Detection accuracy</p>
          </div>
          <div>
            <div className="text-3xl font-black text-primary mb-1">20+</div>
            <p className="text-sm text-muted-foreground">Disease types</p>
          </div>
          <div>
            <div className="text-3xl font-black text-primary mb-1">&lt;2s</div>
            <p className="text-sm text-muted-foreground">Analysis time</p>
          </div>
        </div>

        {/* Code snippet - Creative styling */}
        <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Get started in one command</p>
          <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary">$</span>
              <span className="text-muted-foreground">npm create herd-ai@latest</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
