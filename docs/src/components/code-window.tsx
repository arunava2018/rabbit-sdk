"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

interface CodeWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  filename?: string
  language?: string
  rawCode?: string
}

export function CodeWindow({
  children,
  filename,
  language,
  rawCode,
  className,
  ...props
}: CodeWindowProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(() => {
    if (!rawCode) return
    navigator.clipboard.writeText(rawCode)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }, [rawCode])

  return (
    <div
      className="relative my-6 overflow-hidden rounded-xl border border-gray-800 bg-[#0d1117] shadow-2xl"
      {...props}
    >
      <div className="flex items-center justify-between bg-[#161b22] px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {/* Mac window controls */}
          <div className="flex items-center gap-1.5 mr-4">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          {filename && (
            <div className="rounded-md bg-gray-800/50 px-3 py-1 text-xs font-mono text-gray-400">
              {filename}
            </div>
          )}
          {language && (
            <div className="text-xs font-medium tracking-wider text-gray-500 uppercase ml-2">
              {language}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            title="Copy code"
          >
            {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto text-sm bg-[#0d1117]">
        {children}
      </div>
    </div>
  )
}
