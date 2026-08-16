"use client"

import React, { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { useTheme } from "next-themes"

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-sans)",
    })
    
    // We need a unique ID for each render
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
    
    mermaid.render(id, chart)
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg)
      })
      .catch((e) => {
        console.error("Mermaid parsing error:", e)
        setSvg(`<div class="text-red-500 text-sm p-4 border border-red-500/50 rounded bg-red-500/10">Failed to render diagram</div>`)
      })
  }, [chart, resolvedTheme])

  return (
    <div
      ref={ref}
      className="my-8 flex justify-center p-6 rounded-xl border border-border bg-card shadow-sm overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
