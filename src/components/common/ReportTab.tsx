// components/common/ReportTab.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tab } from "@/schema-types/report-schema";

type ReportTabsUIProps = {
  tabs: Tab[];
  defaultTab: string;
};

export default function ReportTabsUI({ tabs, defaultTab }: ReportTabsUIProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="flex gap-2 border-b border-gray-200">
        {tabs.map(({ name, icon: Icon }) => (
          <TabsTrigger
            key={name}
            value={name}
            className="data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 hover:text-gray-700 px-4 py-2 font-medium border-b-2 border-transparent flex items-center gap-2"
          >
            {Icon && <Icon className="w-4 h-4" />}
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ name, content }) => (
        <TabsContent key={name} value={name}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
