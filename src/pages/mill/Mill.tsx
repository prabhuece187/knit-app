import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import AddMill from "./component/AddMill";
import EditMill from "./component/EditMill";

import { getMillColumns } from "./constant/mill-config";
import type { Mill } from "@/schema-types/master-schema";
import type { MillQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetMillQuery } from "@/api/MillApi";

export default function Mill() {
  const [open, setOpen] = useState(false);
  const [selectedMillId, setSelectedMillId] = useState<number | null>(null);

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<MillQuery, Mill>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useGetMillQuery({ ...queryParams }, { refetchOnMountOrArgChange: true });

  const handleEdit = useCallback((id: number) => {
    setSelectedMillId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedMillId(null);
    setOpen(true);
  }, []);

  const columns = useMemo(() => getMillColumns(handleEdit), [handleEdit]);

  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add Mill</Button>,
    [handleAdd],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Mills"
        columns={columns}
        data={response?.data ?? []}
        meta={response?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search mills..."
        searchValue={searchTerm}
        module="mill"
        trigger={triggerButton}
      />

      {selectedMillId ? (
        <EditMill id={selectedMillId} open={open} setOpen={setOpen} />
      ) : (
        <AddMill open={open} setOpen={setOpen} />
      )}
    </>
  );
}
