import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  CreditCard,
  // Map,
  // PieChart,
  SquareTerminal,
} from "lucide-react";
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/sidebar"
import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "@/layout/components/nav-user";
import { useAppSelector } from "@/store/Store";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  collapsed?: boolean;
};

export function AppSidebar({ collapsed, ...props }: AppSidebarProps) {

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
  const isUser = !user?.role;

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
            title: "Banks",
            url: "/banks",
          },
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
            title: "Knitting Machine",
            url: "/knitting-machine",
          },

          {
            title: "Yarn Types",
            url: "/yarn_types",
          },
          {
            title: "States",
            url: "/states",
          },
          {
            title: "District",
            url: "/districts",
          },
          {
            title: "Cities",
            url: "/cities",
          },
          {
            title: "Pincodes",
            url: "/pincodes",
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
            title: "Job Card",
            url: "/job-master",
          },
          {
            title: "Outward",
            url: "/outward",
          },
          {
            title: "Production",
            url: "/knit-pro",
          },
          {
            title: "Production Return",
            url: "/pro-return",
          },
          {
            title: "Production Rework",
            url: "/pro-rework",
          },
        ],
      },
      {
        title: "Billing",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Invoice",
            url: "/invoice",
          },
          {
            title: "Payment",
            url: "/payment",
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
          {
            title: "JobLedger Report",
            url: "/job-ledger",
          },
          {
            title: "Wastage Report",
            url: "/Wastage",
          },
        ],
      },
      ...(isAdmin ? [
        {
          title: "ProMasters",
          url: "#",
          icon: SquareTerminal,
          isActive: true,
          items: [
            {
              title: "States",
              url: "/states",
            },
            {
              title: "Districts",
              url: "/districts",
            },
            {
              title: "Cities",
              url: "/cities",
            },
            {
              title: "Pincodes",
              url: "/pincodes",
            },
          ],
        },
        {
          title: "Admin",
          url: "#",
          icon: Bot,
          items: [
            {
              title: "Professionals",
              url: "/professionals",
            },
            {
              title: "Referrers",
              url: "/Referrers",
            },
            {
              title: "Billings",
              url: "/billings",
            },
            {
              title: "Appointments  ",
              url: "/appointments",
            },
            {
              title: "Reviews",
              url: "/reviews",
            },
            {
              title: "Clients",
              url: "/clients",
            },
            {
              title: "FAQ",
              url: "/faq",
            },
          ],
        },
      ] : []),

      // User
      ...(isUser ? [
        {
          title: "Professional",
          url: "#",
          icon: Bot,
          items: [
            {
              title: "Profile",
              url: "/profile",
            },
            {
              title: "Billing",
              url: "/billing",
            },
            {
              title: "Appointments  ",
              url: "/appointments",
            },
            {
              title: "Reviews",
              url: "/reviews",
            },
            {
              title: "Clients",
              url: "/clients",
            },
          ],
        },

        {
          title: "Subscription",
          url: "#",
          icon: CreditCard,
          items: [
            {
              title: "Subscription Plans",
              url: "/subscription",
            },
            {
              title: "Feature Subscription",
              url: "/features/subscription",
            },
          ],
        },
      ] : []),
    ],

  };

  const userData = user
    ? {
      id: user.id,
      name: user.firstName || "User",
      email: user.email,
      avatar: user.image || "/avatars/default.jpg",
    }
    : {
      id: 0,
      name: "Guest",
      email: "guest@example.com",
      avatar: "/avatars/default.jpg",
    };

  return (
    <>
      <Sidebar
        collapsible="icon"
        className={`transition-all duration-300 ${collapsed ? "w-[60px]" : "w-[250px]"
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
          <NavUser user={userData} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
