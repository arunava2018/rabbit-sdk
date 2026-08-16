"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableOfContentsProps {
  headings: {
    level: number
    text: string
    id: string
  }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-5% 0% -80% 0%", threshold: 0 }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav className="text-sm">
      {/* "ON THIS PAGE" label matching reference */}
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        On This Page
      </p>
      <ul className="space-y-0.5 list-none m-0 p-0">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1 text-[13px] transition-colors no-underline border-l-2 border-transparent",
                heading.level === 3 ? "pl-5" : "pl-3",
                activeId === heading.id
                  ? "text-blue-600 dark:text-blue-400 font-medium border-l-blue-500"
                  : "text-muted-foreground hover:text-foreground hover:border-l-muted-foreground/30"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
