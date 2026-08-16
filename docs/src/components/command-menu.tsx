"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search } from "lucide-react"
import { docsPageOrder } from "@/config/docs"
import { cn } from "@/lib/utils"

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "relative inline-flex h-9 w-full items-center justify-start rounded-md border border-input bg-muted/50 px-4 py-2 text-sm font-normal text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:pr-12 md:w-64 lg:w-80"
        )}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all" onClick={() => setOpen(false)} />
          <Command
            className="relative z-50 flex h-full w-full max-w-[640px] flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl sm:h-auto sm:max-h-[80vh]"
            loop
            shouldFilter={true}
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input 
                autoFocus
                placeholder="Search pages..." 
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
              <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
              <Command.Group heading="Documentation Pages" className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                {docsPageOrder.map((page) => (
                  <Command.Item
                    key={page.href}
                    value={page.title}
                    onSelect={() => {
                      runCommand(() => router.push(page.href))
                    }}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500/50" />
                      {page.title}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </>
  )
}
