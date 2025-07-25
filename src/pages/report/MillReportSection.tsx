import ReportTabs from "@/components/common/ReportTab";
import type { Tab } from "@/schema-types/report-schema";
import { FileText, ListOrdered } from "lucide-react";

const tabList: Tab[] = [
  {
    name: "Mill Details",
    icon: FileText,
    content: <div>Mill Details list</div>,
  },
  {
    name: "Party Wise Report",
    icon: ListOrdered,
    content: <div>Party Wise Report details</div>,
  },
];

export default function MillReportSection() {
  return <ReportTabs tabs={tabList} defaultTab="Mill Details" />;
}
