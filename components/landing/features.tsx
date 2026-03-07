"use client"

import { Brain, Zap, BarChart3, Shield, Smartphone, Clock } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning identifies diseases with 95%+ accuracy across 20+ livestock conditions.",
      gradientFrom: "rgb(110, 140, 120)",
      gradientTo: "rgb(110, 140, 120)"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive health analysis in under 2 seconds. No waiting, immediate insights for quick decisions.",
      gradientFrom: "rgb(100, 150, 160)",
      gradientTo: "rgb(100, 150, 160)"
    },
    {
      icon: BarChart3,
      title: "Complete Tracking",
      description: "Monitor herd health with detailed records, treatment history, and recovery progress over time.",
      gradientFrom: "rgb(95, 130, 115)",
      gradientTo: "rgb(95, 130, 115)"
    },
    {
      icon: Shield,
      title: "Preventive Care",
      description: "Catch diseases early before symptoms appear. Prevent losses and protect your investment.",
      gradientFrom: "rgb(100, 130, 160)",
      gradientTo: "rgb(100, 130, 160)"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Analyze livestock images directly from your phone. Works offline for remote farm locations.",
      gradientFrom: "rgb(140, 110, 160)",
      gradientTo: "rgb(140, 110, 160)"
    },
    {
      icon: Clock,
      title: "Vet Support 24/7",
      description: "Connect with qualified veterinarians anytime. Get expert advice when you need it most.",
      gradientFrom: "rgb(160, 120, 90)",
      gradientTo: "rgb(160, 120, 90)"
    }
  ]

  return (
    <section id="features" className="py-24 lg:py-32 relative scroll-mt-28">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-features" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-features)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Section heading */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Everything you need to protect your herd. Comprehensive livestock health management powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Features grid - 3 columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group rounded-2xl border border-border/50 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
