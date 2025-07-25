import { useMemo } from "react";
import type {
  Customer,
  Item,
  Mill,
  SidebarRightData,
  YarnType,
} from "@/schema-types/master-schema";
import type z from "zod";
import { customerSchema } from "@/schema-types/master-schema";
import { useParams } from "react-router-dom";

import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";
import { useGetYarnTypeListQuery } from "@/api/YarnTypeApi";
import { useGetItemListQuery } from "@/api/ItemApi";
import { SidebarRight } from "@/components/sidebar-right";
import SidebarRightContent from "@/components/common/SidebarRightContent";
import CommonHeader from "@/components/common/CommonHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomerReportSection from "./CustomerReportSection";
import MillReportSection from "./MillReportSection";
import ItemReportSection from "./ItemReportSection";

export type APIResponseCustomer = z.infer<typeof customerSchema>;

export default function IndizualData() {
  const { id } = useParams();
  const { name } = useParams<{ name: string }>();

  console.log(id);
  const decoded = atob(name!);

  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };
  const { data: mills = [] } = useGetMillListQuery("") as {
    data: Mill[];
  };
  const { data: yarn_type = [] } = useGetYarnTypeListQuery("") as {
    data: YarnType[];
  };
  const { data: items = [] } = useGetItemListQuery("") as {
    data: Item[];
  };

  const sidebarData = useMemo<SidebarRightData[]>(() => {
    switch (decoded) {
      case "Customer":
        return customers.map((c: APIResponseCustomer) => ({
          id: c.id || 1,
          name: c.customer_name,
          detail: c.customer_mobile ?? "",
        }));
      case "Mill":
        return mills.map((m) => ({
          id: m.id || 1,
          name: m.mill_name,
          detail: m.mobile_number ?? "",
        }));
      case "Item":
        return items.map((i) => ({
          id: i.id || 1,
          name: i.item_name,
          detail: i.item_code ?? "",
        }));
      case "YarnType":
        return yarn_type.map((y) => ({
          id: y.id || 1,
          name: y.yarn_type,
          detail: "",
        }));
      default:
        return [];
    }
  }, [decoded, customers, mills, items, yarn_type]);

  // const sidebarData = useMemo<SidebarRightData[]>(() => {
  //   return customers.map((c: APIResponseCustomer) => ({
  //     id: c.id ?? 1,
  //     name: c.customer_name,
  //     detail: c.customer_mobile ?? "",
  //   }));
    // }, [customers]);

    let reportContent: React.ReactNode;
    
    switch (decoded) {
      case "Customer":
        reportContent = <CustomerReportSection />;
        break;
      case "Mill":
        reportContent = <MillReportSection />;
        break;
      case "Item":
        reportContent = <ItemReportSection />;
        break;
      default:
        reportContent = (
          <div className="text-gray-500">No report available</div>
        );
    }

  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 h-full h-screen">
      {/* Sidebar */}
      <SidebarRight className="w-full">
        <SidebarRightContent title="Customer Details" items={sidebarData} />
      </SidebarRight>

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        <CommonHeader name="Indizual" trigger={<Button>Edit</Button>} />
        <Card className="@container/card">
          <CardContent className="pt-4">{reportContent}</CardContent>
        </Card>
      </div>
    </div>
  );
}
