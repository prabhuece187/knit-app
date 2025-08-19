import ReportTabs from "@/components/common/ReportTab";
import type { Tab } from "@/schema-types/report-schema";
import { FileText, User, ScrollText, ListOrdered } from "lucide-react";
// import ProfileCard from "./common/ProfileCard";
import CustomerProfile from "./CustomerProfile";
import CustomerLedger from "./CustomerLedger";
import CustomerLedgerItemWise from "./CustomerLedgerItemWise";
import CustomerIndividualItem from "./CustomerIndividualItem";

type Props = {
  id: number;
};

export default function CustomerReportSection({ id }: Props) {
  const tabList: Tab[] = [
    {
      name: "Transactions",
      icon: FileText,
      content: <div>Customer transaction list</div>,
    },
    { name: "Profile", icon: User, content: <CustomerProfile id={id} /> },
    {
      name: "Ledger (Statement)",
      icon: ScrollText,
      content: <CustomerLedger id={id} />,
    },
    {
      name: "Item Wise ",
      icon: ListOrdered,
      content: <CustomerLedgerItemWise id={id} />,
    },
    {
      name: "Individual Item Wise",
      icon: ListOrdered,
      content: <CustomerIndividualItem id={id} />,
    },
  ];
  return <ReportTabs key={id} tabs={tabList} defaultTab="Transactions" />;
}
