"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Upload, BarChart3, MessageSquare, CalendarCheck, Menu, X, LogOut, Home } from "lucide-react"

const navItems = [
  { label: "Upload", href: "/dashboard", icon: Upload },
  { label: "Results", href: "/dashboard/results", icon: BarChart3 },
  { label: "AI Assistant", href: "/dashboard/assistant", icon: MessageSquare },
  { label: "Booking", href: "/dashboard/booking", icon: CalendarCheck },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
            <Image
              src="/Herd-AI Logo.png"
              alt="Herd AI Logo"
              width={100}
              height={100}
            />
          </Link>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-border px-3 py-3 flex flex-col gap-0.5">
            <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              <LogOut className="h-4 w-4" />
              Log Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Herd-AI Logo.png"
            alt="Herd AI Logo"
            width={100}
            height={100}
          />
        </Link>
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-foreground hover:bg-secondary transition-colors cursor-pointer"
          role="button"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
            <div className="flex flex-col h-full pt-14">
              <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              <div className="border-t border-border px-3 py-3">
                <Link href="/login" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 lg:pl-64">
        <div className="pt-20 lg:pt-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
