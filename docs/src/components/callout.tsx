import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  icon?: string
  title?: string
  children?: React.ReactNode
  type?: "default" | "warning" | "danger" | "info"
}

export function Callout({
  title,
  children,
  icon,
  type = "default",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn("my-6 flex rounded-xl border p-4 shadow-sm", {
        "border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-200": type === "danger",
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-900 dark:text-yellow-200": type === "warning",
        "border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-200": type === "info",
        "border-border bg-muted/30 text-foreground": type === "default",
      })}
      {...props}
    >
      <div className={cn("mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", {
        "bg-red-500/20 text-red-600 dark:text-red-400": type === "danger",
        "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400": type === "warning",
        "bg-blue-500/20 text-blue-600 dark:text-blue-400": type === "info",
        "bg-foreground/10 text-foreground": type === "default",
      })}>
        {icon === "warning" && <AlertTriangle className="h-3.5 w-3.5" />}
        {icon === "info" && <Info className="h-3.5 w-3.5" />}
        {icon === "idea" && <Lightbulb className="h-3.5 w-3.5" />}
        {!icon && type === "danger" && <AlertTriangle className="h-3.5 w-3.5" />}
        {!icon && type === "warning" && <AlertTriangle className="h-3.5 w-3.5" />}
        {!icon && type === "info" && <Info className="h-3.5 w-3.5" />}
        {!icon && type === "default" && <Info className="h-3.5 w-3.5" />}
      </div>
      <div className="flex flex-col gap-1.5 leading-relaxed">
        {title && <div className="font-semibold tracking-tight">{title}</div>}
        <div className="text-sm opacity-90 [&>p]:m-0">{children}</div>
      </div>
    </div>
  )
}
