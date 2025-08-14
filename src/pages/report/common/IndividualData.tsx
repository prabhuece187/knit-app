import { useMemo, useState } from "react";
import type {
  Customer,
  Item,
  Mill,
  SidebarRightData,
  YarnType,
} from "@/schema-types/master-schema";
import type z from "zod";
import { customerSchema } from "@/schema-types/master-schema";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCustomerListQuery,
  useGetSingleCustomerDataQuery,
} from "@/api/CustomerApi";
import { useGetItemListQuery, useGetSingleItemDataQuery } from "@/api/ItemApi";
import {
  useGetYarnTypeListQuery,
  useGetSingleYarnTypeDataQuery,
} from "@/api/YarnTypeApi";
import { SidebarRight } from "@/components/sidebar-right";
import SidebarRightContent from "@/components/common/SidebarRightContent";
import CommonHeader from "@/components/common/CommonHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomerReportSection from "../CustomerReportSection";
import MillReportSection from "../MillReportSection";
import ItemReportSection from "../ItemReportSection";
import YarnTypeReportSection from "../YarnTypeReportSection";
import { skipToken } from "@reduxjs/toolkit/query";
import EditCustomer from "../../customer/component/EditCustomer";
import EditMill from "../../mill/component/EditMill";
import EditYarnType from "../../yarntype/component/EditYarnType";
import EditItem from "../../items/component/EditItem";
import { useGetMillListQuery, useGetSingleMillDataQuery } from "@/api/MillApi";

export type APIResponseCustomer = z.infer<typeof customerSchema>;

export default function IndividualData() {
  const { id } = useParams();
  const decodedId = id ? atob(id) : "";

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const currentPage = pathParts[1]; // e.g., 'customers', 'mills', etc.

  const titleMap: Record<string, string> = {
    customers: "Customer",
    mills: "Mill",
    items: "Item",
    yarn_types: "YarnType",
  };
  const title = titleMap[currentPage] || "Unknown";

  const editComponentMap: Record<string, React.ElementType> = {
    Customer: EditCustomer,
    Mill: EditMill,
    Item: EditItem,
    YarnType: EditYarnType,
  };

  const EditComponent = editComponentMap[title];

  // List queries
  const { data: customers = [] } = useGetCustomerListQuery(
    currentPage === "customers" ? "" : skipToken
  ) as { data: Customer[] };

  const { data: mills = [] } = useGetMillListQuery(
    currentPage === "mills" ? "" : skipToken
  ) as { data: Mill[] };

  const { data: items = [] } = useGetItemListQuery(
    currentPage === "items" ? "" : skipToken
  ) as { data: Item[] };

  const { data: yarn_types = [] } = useGetYarnTypeListQuery(
    currentPage === "yarn_types" ? "" : skipToken
  ) as { data: YarnType[] };

  console.log(yarn_types);

  // Single record queries
  const { data: singleCustomer } = useGetSingleCustomerDataQuery(
    currentPage === "customers" && decodedId ? decodedId : skipToken
  );

  const { data: singleMill } = useGetSingleMillDataQuery(
    currentPage === "mills" && decodedId ? decodedId : skipToken
  );

  const { data: singleItem } = useGetSingleItemDataQuery(
    currentPage === "items" && decodedId ? decodedId : skipToken
  );

  const { data: singleYarnType } = useGetSingleYarnTypeDataQuery(
    currentPage === "yarn_types" && decodedId ? decodedId : skipToken
  );


  // Name display
  let name = "Loading...";
  if (currentPage === "customers") {
    name = singleCustomer?.customer_name || "Loading...";
  } else if (currentPage === "mills") {
    name = singleMill?.mill_name || "Loading...";
  } else if (currentPage === "items") {
    name = singleItem?.item_name || "Loading...";
  } else if (currentPage === "yarn_types") {
    name = singleYarnType?.yarn_type || "Loading...";
  }

  // Sidebar list
  const sidebarData = useMemo<SidebarRightData[]>(() => {
    switch (currentPage) {
      case "customers":
        return customers.map((c) => ({
          id: c.id ?? 1,
          name: c.customer_name,
          detail: c.customer_mobile ?? "",
        }));
      case "mills":
        return mills.map((m) => ({
          id: m.id ?? 1,
          name: m.mill_name,
          detail: m.mobile_number ?? "",
        }));
      case "items":
        return items.map((i) => ({
          id: i.id ?? 1,
          name: i.item_name,
          detail: i.item_code ?? "",
        }));
      case "yarn_types":
        return yarn_types.map((y) => ({
          id: y.id ?? 1,
          name: y.yarn_type,
          detail: "",
        }));
      default:
        return [];
    }
  }, [currentPage, customers, mills, items, yarn_types]);

  // Report section
  let reportContent: React.ReactNode = (
    <div className="text-gray-500">No report available</div>
  );
  switch (currentPage) {
    case "customers":
      reportContent = <CustomerReportSection id={Number(decodedId)} />;
      break;
    case "mills":
      reportContent = <MillReportSection id={Number(decodedId)} />;
      break;
    case "items":
      reportContent = <ItemReportSection id={Number(decodedId)} />;
      break;
    case "yarn_types":
      reportContent = <YarnTypeReportSection id={Number(decodedId)} />;
      break;
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 h-full h-screen">
      {/* Sidebar */}
      <SidebarRight className="w-full max-w-[200px]">
        <SidebarRightContent title={title} items={sidebarData} />
      </SidebarRight>

      {/* Main Content */}
      <div className="flex flex-col gap-2">
        <CommonHeader
          name={name}
          trigger={
            <Button onClick={() => setOpen(true)} size="sm">
              Edit
            </Button>
          }
        />
        <Card className="@container/card">
          <CardContent className="pt-1 mb-2">{reportContent}</CardContent>
        </Card>
      </div>

      {EditComponent && (
        <EditComponent id={Number(decodedId)} open={open} setOpen={setOpen} />
      )}
    </div>
  );
}
