import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import { getStateColumns } from "./constant/state-config";
import AddState from "./component/AddState";
import EditState from "./component/EditState";

import type { State } from "@/schema-types/master-schema";
import type { StateQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetStateQuery } from "@/api/StateApi";

export default function State() {
  const [open, setOpen] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<StateQuery, State>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useGetStateQuery({ ...queryParams }, { refetchOnMountOrArgChange: true });

  console.log("response", response);
  console.log("isError", isError);

  const handleEdit = useCallback((id: number) => {
    setSelectedStateId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedStateId(null);
    setOpen(true);
  }, []);

  const columns = useMemo(() => getStateColumns(handleEdit), [handleEdit]);

  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add State</Button>,
    [handleAdd],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="States"
        columns={columns}
        data={response?.data ?? []}
        meta={response?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search states..."
        searchValue={searchTerm}
        module="state"
        trigger={triggerButton}
      />

      {selectedStateId ? (
        <EditState StateId={selectedStateId} open={open} setOpen={setOpen} />
      ) : (
        <AddState open={open} setOpen={setOpen} />
      )}
    </>
  );
}
