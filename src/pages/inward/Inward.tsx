import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { getInwardColumns } from "./constant/inward-config";
import {
  type InwardQuery,
  type InwardWithRelations,
} from "@/schema-types/inward-schema";
import { useDataTable } from "@/hooks/useDataTable";
import { useGetInwardQuery } from "@/api/InwardApi";
import { useNavigate } from "react-router-dom";

export default function Inward() {
  const navigate = useNavigate();

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<InwardQuery, InwardWithRelations>({
    searchField: "search", // ✅ MATCH BACKEND
    initialLimit: 10,
    initialPage: 1,
  });

  const { data, isLoading, isError } = useGetInwardQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  const handleEdit = useCallback(
    (id: number) => navigate(`/editinward/${id}`),
    [navigate],
  );

  const columns = useMemo(() => getInwardColumns(handleEdit), [handleEdit]);

  return (
    <EnhancedDataTableCard
      name="Inward"
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
      searchPlaceholder="Search inward / customer / mill..."
      trigger={
        <Button onClick={() => navigate("/addinward")}>Add Inward</Button>
      }
    />
  );
}
