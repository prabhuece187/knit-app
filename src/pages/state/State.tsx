import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";

import { getStateColumns } from "./constant/state-config";
import AddState from "./component/AddState";
import EditState from "./component/EditState";

import type { State } from "@/schema-types/master-schema";
import type { StateQuery } from "@/schema-types/master-schema";

import { useDataTable } from "@/hooks/useDataTable";
import { useGetStateQuery, useDeleteStateMutation } from "@/pages/state/api/StateApi";
import { toast } from "sonner";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";

export default function State() {
  const [open, setOpen] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

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
  } = useDataTable<StateQuery, State>({
    searchField: "name",
    initialLimit: 10,
    initialPage: 1,
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useGetStateQuery({ ...queryParams }, { refetchOnMountOrArgChange: true });

  const [deleteState] = useDeleteStateMutation();

  const handleEdit = useCallback((id: number) => {
    setSelectedStateId(id);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedStateId(null);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteState(id)
        .unwrap()
        .then((response) => {
          toast.success(response.message);
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    },
    [deleteState]
  );

  // const columns = useMemo(() => getStateColumns(handleEdit), [handleEdit]);

  const columns = useMemo(
    () =>
      getStateColumns({
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


  // Memoize table configuration
  // const tableConfig = {
  //   fixedColumns: {
  //     left: ["id", "name"],
  //     right: ["actions"],
  //   },
  // }

  // Define filter options for ServerFacetedFilter
  const stateTypeFilterOptions = [
    { label: "State", value: "STATE" },
    { label: "Union Territory", value: "UNION_TERRITORY" },
    { label: "All", value: undefined },
  ];

  // Configuration: Set to true for single-select, false for multi-select
  const isSingleSelect = true;

  // Handle type filter changes - supports both single and multi-select
  const handleTypeFilterChange = useCallback(
    (values: string[]) => {
      handleFilterChange({
        ...filters,
        type: isSingleSelect
          ? values.length > 0
            ? values[0]
            : "" // Single select: empty string will be filtered out
          : values.length > 0
            ? values.join(",")
            : "", // Multi-select: empty string will be filtered out
      });
    },
    [filters, handleFilterChange]
  );

  // Memoize filter components with ServerFacetedFilter
  const filterComponents = useMemo(
    () => (
      <ServerFacetedFilter
        title="Type"
        options={stateTypeFilterOptions}
        selectedValues={
          isSingleSelect
            ? filters.type
              ? [filters.type]
              : [] // Single select: wrap in array
            : filters.type
              ? filters.type.split(",").filter(Boolean)
              : [] // Multi-select: split by comma
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
        filterComponents={filterComponents}
      />

      {selectedStateId ? (
        <EditState StateId={selectedStateId} open={open} setOpen={setOpen} />
      ) : (
        <AddState open={open} setOpen={setOpen} />
      )}
    </>
  );
}
