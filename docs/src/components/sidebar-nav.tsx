"use client"

import * as React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "@/config/docs"
import { cn } from "@/lib/utils"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()
  
  // Find which section should be open initially based on pathname
  const initialExpanded = items.map((_, i) => {
    return items[i].items?.some(item => pathname === item.href) || false
  })
  
  const [expanded, setExpanded] = React.useState<boolean[]>(initialExpanded)

  const toggleSection = (index: number) => {
    setExpanded(prev => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  // Ensure active section is expanded if route changes externally
  React.useEffect(() => {
    setExpanded(prev => prev.map((isExpanded, i) => 
      isExpanded || (items[i].items?.some(item => pathname === item.href) || false)
    ))
  }, [pathname, items])

  return items.length ? (
    <div className="w-full space-y-2">
      {items.map((section, index) => (
        <div key={index} className="flex flex-col gap-1">
          <button 
            onClick={() => toggleSection(index)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-muted/50 transition-colors"
          >
            {section.title}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", expanded[index] ? "rotate-90" : "")}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          
          {expanded[index] && section?.items?.length ? (
            <div className="overflow-hidden pt-1 pb-2">
              <DocsSidebarNavItems items={section.items} pathname={pathname} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({ items, pathname }: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="flex flex-col gap-0.5">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group relative flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-all",
              pathname === item.href
                ? "font-semibold text-foreground bg-accent/60"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
            )}
          >
            {/* Active indicator */}
            {pathname === item.href && (
              <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-blue-500" />
            )}
            <span className="pl-1">{item.title}</span>
            {item.label && (
              <span className="ml-auto rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md px-3 py-1.5 text-sm text-muted-foreground/50"
          >
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null
}
