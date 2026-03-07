import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="animate-fade-in">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/Herd-AI Logo.png"
                alt="Herd AI Logo"
                width={100}
                height={100}
              />
            </div>
            <p className="text-sm text-muted-foreground">AI-powered livestock health detection for modern farms.</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Product</p>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Developers</p>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Company</p>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground text-center md:text-left mb-4 md:mb-0">
            © 2026 Herd AI, Inc. Developed by Nicolas Muhigi
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
