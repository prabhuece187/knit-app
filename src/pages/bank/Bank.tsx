import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import AddBank from "./component/AddBank";
import EditBank from "./component/EditBank";

import { getBankColumns } from "./constant/bank-config";
import type { Bank, BankQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetBankQuery } from "@/api/BankApi";

export default function Bank() {
  // -----------------------
  // Dialog state
  // -----------------------
  const [open, setOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);

  // -----------------------
  // Data table hook (pagination, search, sort)
  // -----------------------
  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<BankQuery, Bank>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  // -----------------------
  // RTK Query: fetch banks
  // -----------------------
  const {
    data: response,
    isLoading,
    isError,
  } = useGetBankQuery(
    { ...queryParams }, // ensure new reference
    { refetchOnMountOrArgChange: true },
  );

  // -----------------------
  // Dialog handlers
  // -----------------------
  const handleEdit = useCallback((id: number) => {
    setSelectedBankId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedBankId(null);
    setOpen(true);
  }, []);

  // -----------------------
  // Columns & trigger button
  // -----------------------
  const columns = useMemo(() => getBankColumns(handleEdit), [handleEdit]);

  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add Bank</Button>,
    [handleAdd],
  );

  // -----------------------
  // Debugging (optional)
  // -----------------------
  console.log("Fetching page:", pagination.page, "limit:", pagination.limit);
  console.log("Query Params:", queryParams);
  console.log("Banks fetched:", response?.data?.length);

  return (
    <>
      <EnhancedDataTableCard
        name="Banks"
        columns={columns}
        data={response?.data ?? []}
        meta={response?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search bank..."
        searchValue={searchTerm}
        module="bank"
        trigger={triggerButton}
      />

      {selectedBankId ? (
        <EditBank id={selectedBankId} open={open} setOpen={setOpen} />
      ) : (
        <AddBank open={open} setOpen={setOpen} />
      )}
    </>
  );
}
