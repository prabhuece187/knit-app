import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import AddYarnType from "./component/AddYarnType";
import EditYarnType from "./component/EditYarnType";

import { getYarnTypeColumns } from "./constant/yarntype-config";
import type { YarnType, YarnTypeQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetYarnTypeQuery } from "@/api/YarnTypeApi";

export default function YarnType() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 🔥 SAME STRUCTURE AS ITEM
  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<YarnTypeQuery, YarnType>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useGetYarnTypeQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  const handleEdit = useCallback((id: number) => {
    setSelectedId(id);
    setOpen(true);
  }, []);

  const columns = useMemo(() => getYarnTypeColumns(handleEdit), [handleEdit]);

  return (
    <>
      <EnhancedDataTableCard
        name="Yarn Types"
        columns={columns}
        data={response?.data ?? []}
        meta={response?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
        searchPlaceholder="Search yarn type..."
        trigger={
          <Button
            onClick={() => {
              setSelectedId(null);
              setOpen(true);
            }}
          >
            Add Yarn Type
          </Button>
        }
      />

      {selectedId ? (
        <EditYarnType id={selectedId} open={open} setOpen={setOpen} />
      ) : (
        <AddYarnType open={open} setOpen={setOpen} />
      )}
    </>
  );
}
