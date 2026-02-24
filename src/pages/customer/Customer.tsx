import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import AddCustomer from "./component/AddCustomer";
import EditCustomer from "./component/EditCustomer";

import {
  getCustomerColumns,
} from "./constant/customer-config";
import type { Customer } from "@/schema-types/master-schema";
import type { CustomerQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetCustomerQuery } from "@/api/CustomerApi";

export default function Customer() {
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<CustomerQuery, Customer>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useGetCustomerQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  const handleEdit = useCallback((id: number) => {
    setSelectedCustomerId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedCustomerId(null);
    setOpen(true);
  }, []);

  const columns = useMemo(() => getCustomerColumns(handleEdit), [handleEdit]);

  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add Customer</Button>,
    [handleAdd],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Customers"
        columns={columns}
        data={response?.data ?? []}
        meta={response?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search customers..."
        searchValue={searchTerm}
        module="customer"
        trigger={triggerButton}
      />

      {selectedCustomerId ? (
        <EditCustomer id={selectedCustomerId} open={open} setOpen={setOpen} />
      ) : (
        <AddCustomer open={open} setOpen={setOpen} />
      )}
    </>
  );
}
