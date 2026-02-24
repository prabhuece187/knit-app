import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetKnittingProductionQuery } from "@/api/KnittingProductionApi";

import type { KnittingProduction, KnittingProductionQuery } from "@/schema-types/production-schema";

import { getKnittingProductionColumns } from "./constant/knitting-production-config";

export default function KnittingProduction() {
  const navigate = useNavigate();

  // const [open, setOpen] = useState(false);

  /* =========================
     useDataTable (Standard)
  ========================= */

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<KnittingProductionQuery, KnittingProduction>({
    searchField: "search", // keeping your old backend param name
    initialLimit: 10,
    initialPage: 1,
  });

  /* =========================
     API Call (Same Logic)
  ========================= */

  const { data, isLoading, isError } = useGetKnittingProductionQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  /* =========================
     Handlers
  ========================= */

  const handleEdit = useCallback(
    (row: KnittingProduction) => {
      navigate(`/knitting_production_edit/${row.id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback((row: KnittingProduction) => {
    console.log("Delete", row);
  }, []);

  /* =========================
     Columns
  ========================= */

  const columns = useMemo(
    () => getKnittingProductionColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete],
  );

  const triggerButton = useMemo(
    () => (
      <Button onClick={() => navigate("/add-knitting-production")}>
        Add Production
      </Button>
    ),
    [navigate],
  );

  /* =========================
     UI
  ========================= */

  return (
    <EnhancedDataTableCard
      name="Knitting Production"
      columns={columns}
      data={data?.data ?? []}
      meta={data?.meta ?? pagination}
      loading={isLoading}
      isError={isError}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      onSortChange={handleSortChange}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search production..."
      searchValue={searchTerm}
      module="knitting-production"
      trigger={triggerButton}
    />
  );
}
