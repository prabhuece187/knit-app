import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import { getProfessionalColumns } from "./constant/professional-config";
import EditProfessional from "./EditProfessional";

import type {
  ProfessionalQuery,
  ProfessionalResponse,
} from "./schema-types/professional-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetProfessionalsQuery, useDeleteProfessionalMutation } from "@/pages/professional/api/ProfessionalApi";
import { toast } from "sonner";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";
import { CommonDrawer } from "@/components/common/CommonDrawer";

export default function Professional() {
  const [open, setOpen] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);

  const {
    pagination,
    searchTerm,
    filters,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    handleFilterChange,
    queryParams,
  } = useDataTable<ProfessionalQuery, ProfessionalResponse>({
    searchField: "name",
    initialLimit: 10,
    initialPage: 1,
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useGetProfessionalsQuery({ ...queryParams }, { refetchOnMountOrArgChange: true });

  const [deleteProfessional] = useDeleteProfessionalMutation();

  const handleEdit = useCallback((id: number) => {
    setSelectedProfessionalId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedProfessionalId(null);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteProfessional(id)
        .unwrap()
        .then((response) => {
          toast.success(response.message);
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    },
    [deleteProfessional]
  );

  const columns = useMemo(
    () =>
      getProfessionalColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        currentSortBy: pagination.sortBy,
        currentSortOrder: pagination.sortOrder,
        onSortChange: handleSortChange,
      }),
    [
      handleEdit,
      handleDelete,
      pagination.sortBy,
      pagination.sortOrder,
      handleSortChange,
    ]
  );

  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add State</Button>,
    [handleAdd],
  );

  const stateTypeFilterOptions = [
    { label: "State", value: "STATE" },
    { label: "Union Territory", value: "UNION_TERRITORY" },
    { label: "All", value: undefined },
  ];

  const isSingleSelect = true;

  const handleTypeFilterChange = useCallback(
    (values: string[]) => {
      handleFilterChange({
        ...filters,
        type: isSingleSelect
          ? values.length > 0
            ? values[0]
            : ""
          : values.length > 0
            ? values.join(",")
            : "",
      });
    },
    [filters, handleFilterChange]
  );

  const filterComponents = useMemo(
    () => (
      <ServerFacetedFilter
        title="Type"
        options={stateTypeFilterOptions}
        selectedValues={
          isSingleSelect
            ? filters.type
              ? [filters.type]
              : []
            : filters.type
              ? filters.type.split(",").filter(Boolean)
              : []
        }
        onValueChange={handleTypeFilterChange}
        singleSelect={isSingleSelect}
      />
    ),
    [stateTypeFilterOptions, filters.type, handleTypeFilterChange]
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Professionals"
        columns={columns}
        data={response?.data ?? []}
        meta={response?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search professionals..."
        searchValue={searchTerm}
        module="professional"
        trigger={triggerButton}
        filterComponents={filterComponents}
      />

      {selectedProfessionalId && (
        <CommonDrawer
          isOpen={open}
          onClose={() => setOpen(false)}
          side="right"
          size="lg"
        >
          <EditProfessional ProfessionalId={selectedProfessionalId} hideHeader={true} />
        </CommonDrawer>
      )}
    </>
  );
}
