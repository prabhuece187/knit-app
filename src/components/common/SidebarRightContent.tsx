import type { SidebarRightData } from "@/schema-types/master-schema";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";

type SidebarRightContentProps = {
  title: string; // Should be 'Customer', 'Mill', 'Item', 'YarnType'
  items: SidebarRightData[];
};

// Map singular title to route prefix
function getPathPrefix(title: string): string {
  const map: Record<string, string> = {
    customer: "customers",
    mill: "mills",
    item: "items",
    yarntype: "yarn_types",
  };

  return map[title.toLowerCase()] || "not-found";
}

// Base64 encode the ID
function encodeId(id: number | string): string {
  return btoa(id.toString());
}

export default function SidebarRightContent({
  title,
  items,
}: SidebarRightContentProps) {
  return (
    <>
      {/* Search input */}
      <div className="flex items-center py-1 px-1">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={`Search ${title}`} className="pl-9 bg-white" />
        </div>
      </div>

      {/* Item list */}
      <div className="p-1 text-left">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.id}-${index}`}
              className="border p-1 gap-1 hover:bg-muted rounded cursor-pointer text-left"
            >
              <NavLink
                to={`/${getPathPrefix(title)}/${encodeId(item.id)}`}
                className={({ isActive }) =>
                  `border cursor-pointer text-left flex flex-col gap-y-1 no-underline text-inherit p-2 rounded
                      ${
                        isActive
                          ? "bg-violet-100 border-violet-500 font-semibold text-primary text-violet-600"
                          : " hover:bg-muted border-transparent"
                      }`
                }
              >
                <p className="text-xs">{item.name}</p>
                <p className="text-sm text-muted-foreground text-[10px]">
                  {item.detail}
                </p>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
