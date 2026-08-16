import * as React from "react"
import { icons } from "lucide-react"

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof icons
}

export function Icon({ name, className, ...props }: IconProps) {
  const LucideIcon = icons[name]

  if (!LucideIcon) {
    return null
  }

  return <LucideIcon className={className} {...props} />
}
