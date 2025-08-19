import ReportTabs from "@/components/common/ReportTab";
import type { Tab } from "@/schema-types/report-schema";
import { FileText, ListOrdered } from "lucide-react";
import MillProfile from "./MillProfile";
import MillLedgerReport from "./MillLedgerReport";
import MillLedgerItemWise from "./MillLedgerItemWise";
import MillIndividualItem from "./MillIndividualItem";

type Props = {
  id: number;
};

export default function MillReportSection({ id }: Props) {
  console.log(id);
  const tabList: Tab[] = [
    {
      name: "Mill Details",
      icon: FileText,
      content: <MillProfile id={id} />,
    },
    {
      name: "Individual Mill Report",
      icon: ListOrdered,
      content: <MillLedgerReport id={id} />,
    },
    {
      name: "Mill Ledger Itemwise",
      icon: ListOrdered,
      content: <MillLedgerItemWise id={id} />,
    },
    {
      name: "Mill Individual Item",
      icon: ListOrdered,
      content: <MillIndividualItem id={id} />,
    },
  ];
  return <ReportTabs key={id} tabs={tabList} defaultTab="Mill Details" />;
}
