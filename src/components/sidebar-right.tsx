import * as React from "react";
// import { Plus } from "lucide-react";

import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  // SidebarHeader,
  // SidebarMenu,
  // SidebarMenuButton,
  // SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

// Sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function SidebarRight({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & { children?: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col">
      {/* === Sidebar container START === */}
      <Sidebar
        collapsible="none"
        className="h-full  border-l bg-background transition-[left,right,width] duration-200 ease-linear"
        {...props}
      >
        {/* <SidebarHeader className="border-sidebar-border h-16 border-b"> */}
        {/* You can put profile/user info here */}
        {/* </SidebarHeader> */}

        <SidebarContent>
          {children ? (
            children
          ) : (
            <>
              <DatePicker />
              <SidebarSeparator className="mx-0" />
              <Calendars calendars={data.calendars} />
            </>
          )}
        </SidebarContent>

        {/* <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Plus />
                  <span>New Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter> */}
      </Sidebar>
      {/* === Sidebar container END === */}
    </div>
  );
}
