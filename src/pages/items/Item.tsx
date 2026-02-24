import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import AddItem from "./component/AddItem";
import EditItem from "./component/EditItem";

import { getItemColumns } from "./constant/item-config";
import type { Item, ItemQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetItemQuery } from "@/api/ItemApi";

// -----------------------
// Helper function to fetch items (optional, if you want manual fetch)
// -----------------------
// Not needed if using RTK Query directly in useGetItemQuery

export default function Item() {
  // -----------------------
  // Dialog state
  // -----------------------
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // -----------------------
  // Data table hook (handles pagination, filters, search, sort)
  // -----------------------
  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<ItemQuery, Item>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  // -----------------------
  // RTK Query: fetch items
  // -----------------------
  const {
    data: response,
    isLoading,
    isError,
  } = useGetItemQuery(
    { ...queryParams }, // ✅ spread to ensure new reference each render
    { refetchOnMountOrArgChange: true }, // ✅ ensures new page triggers fetch
  );

  // -----------------------
  // Dialog handlers
  // -----------------------
  const handleEdit = useCallback((id: number) => {
    setSelectedItemId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedItemId(null);
    setOpen(true);
  }, []);

  // -----------------------
  // Columns & trigger button
  // -----------------------
  const columns = useMemo(() => getItemColumns(handleEdit), [handleEdit]);
  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add Item</Button>,
    [handleAdd],
  );

  // -----------------------
  // Debugging
  // -----------------------
  console.log("Fetching page:", pagination.page, "limit:", pagination.limit);
  console.log("Query Params:", queryParams);
  console.log("Items fetched:", response?.data?.length);

  return (
    <>
      <EnhancedDataTableCard
        name="Items"
        columns={columns}
        data={response?.data ?? []}
        meta={response?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search items by name..."
        searchValue={searchTerm}
        module="item"
        trigger={triggerButton}
      />

      {selectedItemId ? (
        <EditItem id={selectedItemId} open={open} setOpen={setOpen} />
      ) : (
        <AddItem open={open} setOpen={setOpen} />
      )}
    </>
  );
}
