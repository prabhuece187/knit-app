"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { getProductionReturnColumns } from "./constant/pro-return-config";

import {
  type ProductionReturnQuery,
  type ProductionReturnWithRelations,
} from "@/schema-types/production-return-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetReturnsQuery } from "@/api/ProductionReturnApi";

import AddProductionReturn from "./component/AddProductionReturn";
import EditProductionReturn from "./component/EditProductionReturn";

export default function ProductionReturn() {
  const [open, setOpen] = useState(false);

  // ✅ Store full row instead of id
  const [selectedRow, setSelectedRow] = useState<
    ProductionReturnWithRelations | undefined
  >(undefined);

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<ProductionReturnQuery, ProductionReturnWithRelations>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const { data, isLoading, isError } = useGetReturnsQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  // ✅ Pass setSelectedRow instead of setSelectedId
  const columns = useMemo(
    () => getProductionReturnColumns(setOpen, setSelectedRow),
    [],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Production Return"
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
        searchPlaceholder="Search return / job..."
        trigger={
          <Button
            onClick={() => {
              setSelectedRow(undefined); // ✅ Clear selected row
              setOpen(true);
            }}
          >
            Add Return
          </Button>
        }
      />

      {selectedRow ? (
        <EditProductionReturn
          open={open}
          setOpen={setOpen}
          data={selectedRow} // ✅ PASS DATA
        />
      ) : (
        <AddProductionReturn open={open} setOpen={setOpen} />
      )}
    </>
  );
}
