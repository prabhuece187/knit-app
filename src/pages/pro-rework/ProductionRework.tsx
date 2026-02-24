"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { useDataTable } from "@/hooks/useDataTable";

import { useGetReworksQuery } from "@/api/ProductionReworkApi";
import { getKnittingReworkColumns } from "./constant/pro-rework-config";
import type {
  KnittingReworkQuery,
  KnittingReworkWithRelations,
} from "@/schema-types/rework-schema";

import AddProductionRework from "./component/AddProductionRework";
import EditProductionRework from "./component/EditProductionRework";

export default function KnittingRework() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<
    KnittingReworkWithRelations | undefined
  >(undefined);

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<KnittingReworkQuery, KnittingReworkWithRelations>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

   const { data, isLoading, isError } = useGetReworksQuery(
     { ...queryParams },
     { refetchOnMountOrArgChange: true },
   );

  const columns = useMemo(
    () => getKnittingReworkColumns(setOpen, setSelectedRow),
    [],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Knitting Rework"
        columns={columns}
        data={data?.data ?? []}
        meta={data?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
        searchPlaceholder="Search rework / return / job..."
        trigger={
          <Button
            onClick={() => {
              setSelectedRow(undefined);
              setOpen(true);
            }}
          >
            Add Rework
          </Button>
        }
      />

      {selectedRow ? (
        <EditProductionRework
          open={open}
          setOpen={setOpen}
          data={selectedRow}
        />
      ) : (
        <AddProductionRework open={open} setOpen={setOpen} />
      )}
    </>
  );
}
