
import { Separator } from "@radix-ui/react-separator"
import { Outlet } from "react-router-dom"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { ModeToggle } from "../theme/mode-toggle"

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar (includes both mobile & desktop behavior internally) */}

        <AppSidebar  />

        <SidebarInset >
          <div className="sticky top-0 z-50 flex flex-col">
            <header className="bg-background/50 flex h-16 shrink-0 items-center gap-2 px-3 backdrop-blur-xl lg:h-[60px]">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="h-4" />
                </div>
                <ModeToggle />
              </div>
            </header>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

