import {
  useGetDistrictsQuery,
  useDeleteDistrictMutation,
} from "./api/DistrictApi";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getDistrictColumns } from "./constant/district-config";
import AddDistrict from "./component/AddDistrict";
import EditDistrict from "./component/EditDistrict";
import { useDataTable } from "@/hooks/useDataTable";
import type { DistrictQuery } from "./schema-types/district-schema";
import type { District } from "./schema-types/district-schema";
import { toast } from "sonner";
import DistrictFilter from "./component/DistrictFilter";

export default function District() {
  // Data table state management (pagination, search, filters)
  const {
    searchTerm,
    filters,
    queryParams,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    handleFilterChange,
    updatePaginationMeta,
  } = useDataTable<DistrictQuery, District>({
    searchField: "name",
  });

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  // API calls
  const {
    data: response,
    isLoading: districtLoading,
    isError,
  } = useGetDistrictsQuery(queryParams);


  const [deleteDistrict] = useDeleteDistrictMutation();

  // Memoize stable handlers to prevent column recreation
  const handleEdit = useCallback((district: District) => {
    setSelectedDistrict(district);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedDistrict(null);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteDistrict(id)
        .unwrap()
        .then((response) => {
          toast.success(response.message);
        })
        .catch((error) => {
          toast.error(error.data.message);
        });
    },
    [deleteDistrict]
  );

  // Update pagination metadata when response changes
  useEffect(() => {
    if (response?.meta) {
      updatePaginationMeta(response.meta);
    }
  }, [response?.meta, updatePaginationMeta]);

  const districtData = response?.data ?? [];

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(
    () => getDistrictColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  // Memoize filter components
  const filterComponents = useMemo(
    () => (
      <DistrictFilter filters={filters} onFilterChange={handleFilterChange} />
    ),
    [filters, handleFilterChange]
  );

  // Memoize trigger button
  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add District</Button>,
    [handleAdd]
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Districts"
        columns={columns}
        data={districtData}
        meta={response?.meta}
        loading={districtLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search districts by name..."
        searchValue={searchTerm}
        filterComponents={filterComponents}
        module="district"
        trigger={triggerButton}
      // tableConfig={tableConfig}
      />

      {selectedDistrict ? (
        <EditDistrict
          district={selectedDistrict}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddDistrict open={open} setOpen={setOpen} />
      )}
    </>
  );
}
