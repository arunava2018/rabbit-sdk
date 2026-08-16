import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card py-10 mt-auto">
      <div className="container mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-foreground hover:opacity-90 transition-opacity">
            <div className="w-6 h-6 rounded-md overflow-hidden border border-border">
              <img src="/logo.jpg" alt="Rabbit SDK Logo" className="w-full h-full object-cover" />
            </div>
            Rabbit SDK
          </Link>
          <p className="text-xs text-muted-foreground font-medium">
            Production-grade Agent Framework.
          </p>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/docs/getting-started/introduction" className="hover:text-foreground transition-colors">Documentation</Link>
          <Link href="https://github.com/arunava2018/rabbit-sdk" target="_blank" className="hover:text-foreground transition-colors">GitHub</Link>
          <Link href="https://www.npmjs.com/package/@rabbit-agent-sdk/rabbit-agent-sdk" target="_blank" className="hover:text-foreground transition-colors">NPM</Link>
        </div>
      </div>
    </footer>
  )
}
