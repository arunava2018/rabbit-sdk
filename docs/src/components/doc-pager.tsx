"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { docsPageOrder } from "@/config/docs"
import { cn } from "@/lib/utils"

export function DocPager() {
  const pathname = usePathname()
  
  const activeIndex = docsPageOrder.findIndex((link) => link.href === pathname)
  
  if (activeIndex === -1) {
    return null
  }
  
  const prev = activeIndex !== 0 ? docsPageOrder[activeIndex - 1] : null
  const next = activeIndex !== docsPageOrder.length - 1 ? docsPageOrder[activeIndex + 1] : null

  return (
    <div className="flex flex-row items-center justify-between mt-10 space-x-4">
      {prev ? (
        <Link
          href={prev.href}
          className={cn(
            "group flex flex-col gap-2 rounded-xl border bg-card p-4 hover:border-foreground/50 transition-colors w-full text-left"
          )}
        >
          <div className="flex items-center text-sm font-medium text-muted-foreground gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </div>
          <div className="font-semibold text-base group-hover:text-foreground">
            {prev.title}
          </div>
        </Link>
      ) : (
        <div className="w-full" />
      )}
      
      {next ? (
        <Link
          href={next.href}
          className={cn(
            "group flex flex-col gap-2 rounded-xl border bg-card p-4 hover:border-foreground/50 transition-colors w-full text-right items-end"
          )}
        >
          <div className="flex items-center text-sm font-medium text-muted-foreground gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </div>
          <div className="font-semibold text-base group-hover:text-foreground">
            {next.title}
          </div>
        </Link>
      ) : (
        <div className="w-full" />
      )}
    </div>
  )
}
