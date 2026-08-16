"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const cmd = "npm i @rabbit-agent-sdk/rabbit-agent-sdk"
  return (
    <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm font-mono">
      <span className="text-emerald-500 select-none">$</span>
      <span className="text-foreground flex-1">{cmd}</span>
      <button
        onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
