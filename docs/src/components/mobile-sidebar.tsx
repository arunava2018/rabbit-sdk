"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { docsConfig } from "@/config/docs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          />
        }
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
