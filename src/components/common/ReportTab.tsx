// components/common/ReportTab.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tab } from "@/schema-types/report-schema";
import { useEffect, useState } from "react";

type ReportTabsProps = {
  tabs: Tab[];
  defaultTab: string;
};

export default function ReportTabs({ tabs, defaultTab }: ReportTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync with external defaultTab when it changes (like after navigating)
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="p-1">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mx-auto"
      >
        <TabsList className="mb-2 flex w-full justify-start gap-3 border-b bg-transparent pb-0">
          {tabs.map(({ name, icon: Icon }) => (
            <TabsTrigger
              key={name}
              value={name}
              className="text-xs text-muted-foreground data-[state=active]:text-violet-600 data-[state=active]:border-b-violet-600 rounded-none bg-transparent px-1 py-2 pb-3 data-[state=active]:border-b-2 data-[state=active]:bg-transparent flex items-center gap-1"
            >
              {Icon && <Icon className="w-4 h-4" />}
              {name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ name, content }) => (
          <TabsContent key={name} value={name} className="p-0 text-xs">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
