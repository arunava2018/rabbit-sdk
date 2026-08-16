import { docsConfig } from "@/config/docs"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MobileSidebar } from "@/components/mobile-sidebar"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Left sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r border-border">
          <ScrollArea className="h-full py-6 pl-2 pr-4 lg:py-8">
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </ScrollArea>
        </aside>

        {/* Content area — page renders content + TOC as a fragment */}
        <div className="min-w-0">
          {/* Mobile nav bar */}
          <div className="flex md:hidden items-center gap-3 border-b border-border px-4 py-3">
            <MobileSidebar />
            <span className="text-sm font-medium text-muted-foreground">Documentation</span>
          </div>

          {/* Two-column on xl: content | TOC */}
          <div className="px-4 py-8 md:px-8 lg:px-10 xl:grid xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
