import ReportTabs from "@/components/common/ReportTab";
import type { Tab } from "@/schema-types/report-schema";
import { FileText, User, ScrollText } from "lucide-react";
import ItemProfile from "./ItemProfile";
import ItemStockReport from "./ItemStockReport";
import ItemStockCustomerWise from "./ItemStockCustomerWise";
import ItemIndividualCustomer from "./ItemIndividualCustomer";

type Props = {
  id: number;
};

export default function ItemReportSection({ id }: Props) {
  const tabList: Tab[] = [
    {
      name: "Item Details",
      icon: FileText,
      content: <ItemProfile id={id} />,
    },
    {
      name: "Stock Report",
      icon: User,
      content: <ItemStockReport id={id} />,
    },
    {
      name: "Customer Wise (Statement)",
      icon: ScrollText,
      content: <ItemStockCustomerWise id={id} />,
    },
    {
      name: "Individual Customer Report",
      icon: ScrollText,
      content: <ItemIndividualCustomer id={id} />,
    },
  ];

  return <ReportTabs key={id} tabs={tabList} defaultTab="Item Details" />;
}
