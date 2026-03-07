"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Analytics", href: "#analytics" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Stats", href: "#stats" },
    { label: "Pricing", href: "#pricing" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl animate-fade-in">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/Herd-AI Logo.png"
            alt="Herd AI Logo"
            width={100}
            height={100}
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Get started
          </Link>
        </div>

        <div
          className="lg:hidden p-1.5 text-muted-foreground cursor-pointer"
          onClick={() => setOpen(!open)}
          role="button"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 py-5 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <Link href="/login" className="text-sm text-foreground">Log in</Link>
              <Link href="/signup" className="rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground">
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
