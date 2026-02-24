import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { getOutwardColumns } from "./constant/outward-config";
import {
  type OutwardQuery,
  type OutwardWithRelations,
} from "@/schema-types/outward-schema";
import { useDataTable } from "@/hooks/useDataTable";
import { useGetOutwardQuery } from "@/api/OutwardApi";
import { useNavigate } from "react-router-dom";

export default function Outward() {
  const navigate = useNavigate();

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<OutwardQuery, OutwardWithRelations>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

  const { data, isLoading, isError } = useGetOutwardQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  const handleEdit = useCallback(
    (id: number) => navigate(`/editoutward/${id}`),
    [navigate],
  );

  const columns = useMemo(() => getOutwardColumns(handleEdit), [handleEdit]);

  return (
    <EnhancedDataTableCard
      name="Outward"
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
      searchPlaceholder="Search outward / invoice / customer / mill..."
      trigger={
        <Button onClick={() => navigate("/addoutward")}>Add Outward</Button>
      }
    />
  );
}
