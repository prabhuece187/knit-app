import { Separator } from "@radix-ui/react-separator";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import { ModeToggle } from "../theme/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
// import { SidebarRight } from "@/components/sidebar-right";
import { useState } from "react";

export default function Layout() {
  // const [sidebarContent, setSidebarContent] = useState<React.ReactNode>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar collapsed={isCollapsed} />

        <SidebarInset>
          <div className="sticky top-0 z-50 flex flex-col px-2">
            <header className="bg-background/50 flex h-16 shrink-0 items-center gap-2 px-2 backdrop-blur-xl lg:h-[53px]">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                  <Separator orientation="vertical" className="h-4" />
                </div>
                <ModeToggle />
              </div>
            </header>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-2">
            <div className="px-2 lg:px-2 flex flex-col gap-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
