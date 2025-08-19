import ReportTabs from "@/components/common/ReportTab";
import type { Tab } from "@/schema-types/report-schema";
import { ScrollText } from "lucide-react";
import YarnTypeLedger from "./YarnTypeLedger";
import YarnTypeIndividualCustomer from "./YarnTypeIndividualCustome";

type Props = {
  id: number;
};

export default function YarnTypeReportSection({ id }: Props) {
  const tabList: Tab[] = [
    {
      name: "Yarn Type Ledger",
      icon: ScrollText,
      content: <YarnTypeLedger id={id} />,
    },
    {
      name: "Individual Customer Wise",
      icon: ScrollText,
      content: <YarnTypeIndividualCustomer id={id} />,
    },
  ];

  return <ReportTabs key={id} tabs={tabList} defaultTab="Yarn Type Ledger" />;
}
