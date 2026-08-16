"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string
}

export function CopyButton({ text, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (hasCopied) {
      timeoutId = setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [hasCopied])

  return (
    <button
      className={cn(
        "relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-md border bg-background text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => {
        navigator.clipboard.writeText(text)
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  )
}
