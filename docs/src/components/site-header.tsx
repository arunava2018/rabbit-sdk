import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { MainNav } from "@/components/main-nav"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { CommandMenu } from "@/components/command-menu"

async function getPackageVersion() {
  try {
    const res = await fetch("https://registry.npmjs.org/@rabbit-agent-sdk/rabbit-agent-sdk", {
      next: { revalidate: 3600 }, // Check for updates hourly
    })
    if (!res.ok) return "0.1.0"
    const data = await res.json()
    return data["dist-tags"]?.latest || "0.1.0"
  } catch (e) {
    return "0.1.0"
  }
}

export async function SiteHeader() {
  const version = await getPackageVersion()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8 mx-auto gap-4">
        {/* Mobile sidebar trigger (docs only) */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-sm shrink-0">
          <span className="text-foreground">🐇 Rabbit SDK</span>
        </Link>

        {/* Main nav */}
        <div className="hidden md:flex items-center gap-1 border-l border-border pl-4">
          <MainNav />
        </div>

        {/* Version badge */}
        <div className="hidden md:flex items-center">
          <a 
            href="https://www.npmjs.com/package/@rabbit-agent-sdk/rabbit-agent-sdk"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1 font-mono hover:border-border/80 hover:text-foreground transition-colors"
          >
            v{version} on npm ↗
          </a>
        </div>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <CommandMenu />
          {/* GitHub */}
          <Link
            href="https://github.com/arunava2018/rabbit-sdk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <span className="sr-only">GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </Link>

          <ModeToggle />

          <Link
            href="/docs/getting-started/introduction"
            className="hidden md:inline-flex h-8 items-center justify-center rounded-md bg-foreground text-background px-4 text-xs font-semibold hover:bg-foreground/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
