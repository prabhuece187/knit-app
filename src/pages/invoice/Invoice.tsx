// src/pages/Invoice.tsx

import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getInvoiceColumns, searchColumns } from "./constant/invoice-config";
import { useGetInvoiceQuery } from "@/api/InvoiceApi"; // 👈 make sure this exists
import { Link, useNavigate } from "react-router-dom";
import type { Invoice } from "@/schema-types/invoice-schema";

export default function Invoice() {
  // Pagination & Search Defaults
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  // Fetch invoice data
  const {
    data: response,
    isLoading: invoiceLoading,
    isError,
  } = useGetInvoiceQuery(
    {
      limit,
      offset,
      curpage,
      searchInput,
    },
    {
      skip: limit === 0 && offset === 0 && curpage === 0 && searchInput === "",
    }
  );

  const navigate = useNavigate();

  const handleEdit = (invoice: Invoice) => {
    navigate(`/editinvoice/${invoice.id}`);
  };

  const handleDelete = (invoice: Invoice) => {
    console.log("Delete", invoice);
  };

  const invoiceData = response?.data ?? [];

  const [open, setOpen] = useState(false);

  const columns = getInvoiceColumns(handleEdit, handleDelete);

  return (
    <>
      <DataTableCard
        name={"Invoice"}
        columns={columns}
        data={invoiceData}
        searchColumns={searchColumns}
        loading={invoiceLoading}
        open={open}
        setOpen={setOpen}
        isError={isError}
        trigger={
          <Button>
            <Link to="/addinvoice">Add Invoice</Link>
          </Button>
        }
      />
    </>
  );
}
