import ReportTabs from "@/components/common/ReportTab";
import type { Tab } from "@/schema-types/report-schema";
import { FileText, User, ScrollText, ListOrdered } from "lucide-react";

const tabList: Tab[] = [
  {
    name: "Transactions",
    icon: FileText,
    content: <div>Item transaction list</div>,
  },
  { name: "Profile", icon: User, content: <div>Item profile info</div> },
  {
    name: "Ledger (Statement)",
    icon: ScrollText,
    content: <div>Ledger details</div>,
  },
  {
    name: "Item Wise Report",
    icon: ListOrdered,
    content: <div>Report based on items sold</div>,
  },
];

export default function ItemReportSection() {
  return <ReportTabs tabs={tabList} defaultTab="Transactions" />;
}
