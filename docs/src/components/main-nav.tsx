"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Overview", href: "/" },
  { title: "Docs", href: "/docs/getting-started/introduction" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith("/docs")
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative px-3 py-1.5 text-sm rounded-md transition-colors",
              isActive
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
