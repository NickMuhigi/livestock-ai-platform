"use client"

import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      quote: "Herd AI has completely transformed how we manage livestock health. The accuracy is remarkable, and catching diseases early has saved us thousands.",
      name: "James Okonkwo",
      title: "Farm Manager, AgriTech Solutions",
      avatar: "J",
      rating: 5
    },
    {
      quote: "The speed and reliability are unmatched. We went from losing animals to diseases to preventing them entirely. Game-changing technology.",
      name: "Maria Sousa",
      title: "Cattle Rancher, Eastern Fields",
      avatar: "M",
      rating: 5
    },
    {
      quote: "Finally, a tool that works in the real world. Mobile, fast, accurate. Every farmer should have this.",
      name: "Robert Chen",
      title: "Dairy Farm Owner, Mountain Vista",
      avatar: "R",
      rating: 5
    }
  ]

  return (
    <section className="py-24 lg:py-32 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Loved by farmers worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of farms saving animals and money with AI-powered health detection.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border/50 bg-gradient-to-br from-card/50 to-card/25 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed text-foreground mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
