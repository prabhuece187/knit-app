import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import AddKnittingMachine from "./component/AddKnittingMachine";
import EditKnittingMachine from "./component/EditKnittingMachine";

import {
  getKnittingMachineColumns,
} from "./constant/knitting-machine-config";

import type { KnittingMachine } from "@/schema-types/master-schema";
import type { KnittingMachineQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetKnittingMachineQuery } from "@/api/KnittingMachineApi";

export default function KnittingMachine() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<KnittingMachineQuery, KnittingMachine>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const { data, isLoading, isError } = useGetKnittingMachineQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  const handleEdit = useCallback((id: number) => {
    setSelectedId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedId(null);
    setOpen(true);
  }, []);

  const columns = useMemo(
    () => getKnittingMachineColumns(handleEdit),
    [handleEdit],
  );

  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add Machine</Button>,
    [handleAdd],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Knitting Machines"
        columns={columns}
        data={data?.data ?? []}
        meta={data?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search machines..."
        searchValue={searchTerm}
        module="knitting-machine"
        trigger={triggerButton}
      />

      {selectedId ? (
        <EditKnittingMachine id={selectedId} open={open} setOpen={setOpen} />
      ) : (
        <AddKnittingMachine open={open} setOpen={setOpen} />
      )}
    </>
  );
}
