import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  // Map,
  // PieChart,
  SquareTerminal,
} from "lucide-react";
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/sidebar"
import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Sequence",
      logo: GalleryVerticalEnd,
      plan: "Knit-app",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Masters",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Customers",
          url: "/customers",
        },
        {
          title: "Items",
          url: "/items",
        },
        {
          title: "Mills",
          url: "/mills",
        },
        {
          title: "States",
          url: "/states",
        },
        {
          title: "Yarn Types",
          url: "/yarn_types",
        },
      ],
    },
    {
      title: "Process",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Inward",
          url: "/inward",
        },
        {
          title: "Outward",
          url: "/outward",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: Frame,
      items: [
        {
          title: "Overall Report",
          url: "/over-all-report",
        },
        {
          title: "Detail Report",
          url: "/over-all-detail-report",
        },
      ],
    },
  ],
  // Reports: [
  //   {
  //     name: "Overall Report",
  //     url: "/over-all-report",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  collapsed?: boolean;
};

export function AppSidebar({ collapsed, ...props }: AppSidebarProps) {
  return (
    <>
      <Sidebar
        collapsible="icon"
        className={`transition-all duration-300 ${
          collapsed ? "w-[60px]" : "w-[250px]"
        }`}
        {...props}
      >
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.Reports} /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
