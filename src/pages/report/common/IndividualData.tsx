import { useMemo, useState } from "react";
import type { Customer, SidebarRightData } from "@/schema-types/master-schema";
import type z from "zod";
import { customerSchema } from "@/schema-types/master-schema";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCustomerListQuery,
  useGetSingleCustomerDataQuery,
} from "@/api/CustomerApi";

import { SidebarRight } from "@/components/sidebar-right";
import SidebarRightContent from "@/components/common/SidebarRightContent";
import CommonHeader from "@/components/common/CommonHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomerReportSection from "../CustomerReportSection";

import { skipToken } from "@reduxjs/toolkit/query";
import EditCustomer from "../../customer/component/EditCustomer";

export type APIResponseCustomer = z.infer<typeof customerSchema>;

export default function IndividualData() {
  const { id } = useParams();
  const decodedId = id ? atob(id) : "";

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const currentPage = pathParts[1]; // e.g., 'customers', 'mills', etc.

  const titleMap: Record<string, string> = {
    customers: "Customer",
  };
  const title = titleMap[currentPage] || "Unknown";

  const editComponentMap: Record<string, React.ElementType> = {
    Customer: EditCustomer,
  };

  const EditComponent = editComponentMap[title];

  // List queries
  const { data: customers = [] } = useGetCustomerListQuery(
    currentPage === "customers" ? "" : skipToken
  ) as { data: Customer[] };

  // Single record queries
  const { data: singleCustomer } = useGetSingleCustomerDataQuery(
    currentPage === "customers" && decodedId ? decodedId : skipToken
  );

  // Name display
  let name = "Loading...";
  if (currentPage === "customers") {
    name = singleCustomer?.customer_name || "Loading...";
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

      default:
        return [];
    }
  }, [currentPage, customers]);

  // Report section
  let reportContent: React.ReactNode = (
    <div className="text-gray-500">No report available</div>
  );
  switch (currentPage) {
    case "customers":
      reportContent = <CustomerReportSection id={Number(decodedId)} />;
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
