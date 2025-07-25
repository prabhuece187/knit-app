import type { SidebarRightData } from "@/schema-types/master-schema";
import { Input } from "../ui/input";

type SidebarRightContentProps = {
  title: string;
  items: SidebarRightData[];
};

export default function SidebarRightContent({
  title,
  items,
}: SidebarRightContentProps) {
  return (
    <>
      <div className="flex items-center py-1 px-1">
        <Input placeholder="Search Customer detail..." className="max-w-sm" />
      </div>
      <div className="p-1 text-left">
        <h2 className="text-xl font-bold mb-1 py-1 px-1">{title}</h2>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item.id}-${index}`}
              className="border-b pb-1 hover:bg-muted rounded px-1 cursor-pointer text-left"
            >
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
