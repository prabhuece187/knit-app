"use client";

import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { useNavigate } from "react-router-dom";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetInvoiceQuery } from "@/api/InvoiceApi";
import { getInvoiceColumns } from "./constant/invoice-config";
import type { Invoice } from "@/schema-types/invoice-schema";
import type {
  InvoiceQuery,
  InvoiceWithRelations,
} from "@/schema-types/invoice-schema";

export default function InvoiceModule() {
  const navigate = useNavigate();

  // Setup pagination, search, sorting
  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<InvoiceQuery, InvoiceWithRelations>({
    searchField: "search", // matches backend search param
    initialLimit: 10,
    initialPage: 1,
  });

  // Fetch invoice data
  const { data, isLoading, isError } = useGetInvoiceQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  // Edit handler
  const handleEdit = useCallback(
    (invoice: Invoice) => {
      navigate(`/editinvoice/${invoice.id}`);
    },
    [navigate],
  );

  // Delete handler
  const handleDelete = useCallback((invoice: Invoice) => {
    console.log("Delete invoice", invoice);
  }, []);

  // Memoize columns
  const columns = useMemo(
    () => getInvoiceColumns(handleEdit, handleDelete, navigate),
    [handleEdit, handleDelete, navigate],
  );

  return (
    <EnhancedDataTableCard
      name="Invoice"
      columns={columns}
      data={data?.data ?? []}
      meta={data?.meta ?? pagination}
      loading={isLoading}
      isError={isError}
      searchValue={searchTerm}
      searchPlaceholder="Search invoice / customer..."
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      onSortChange={handleSortChange}
      onSearchChange={handleSearchChange}
      trigger={
        <Button onClick={() => navigate("/addinvoice")}>Add Invoice</Button>
      }
    />
  );
}
