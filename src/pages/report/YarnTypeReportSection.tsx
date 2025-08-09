import ReportTabs from "@/components/common/ReportTab";
import type { Tab } from "@/schema-types/report-schema";
import {  ScrollText, ListOrdered } from "lucide-react";

const tabList: Tab[] = [
  {
    name: "Yarn Type",
    icon: ScrollText,
    content: <div>Yarn Type details</div>,
  },
  {
    name: "Item Wise Report",
    icon: ListOrdered,
    content: <div>Report based on items sold</div>,
  },
];

export default function YarnTypeReportSection() {
  return <ReportTabs tabs={tabList} defaultTab="Transactions" />;
}
