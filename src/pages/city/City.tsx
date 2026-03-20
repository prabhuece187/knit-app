import { useGetCitiesQuery, useDeleteCityMutation } from "./api/CityApi";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getCityColumns } from "./constant/city-config";
import AddCity from "./component/AddCity";

import { useDataTable } from "@/hooks/useDataTable";
import type { City, CityQuery } from "./schema-types/city-schema";
import { toast } from "sonner";
import CityFilter from "./component/CityFilter";
import EditCity from "./component/EditCity";

export default function City() {
  // Data table state management (pagination, search, filters)
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
    updatePaginationMeta,
  } = useDataTable<CityQuery, City>({
    searchField: "name",
  });

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // API calls
  const {
    data: response,
    isLoading: cityLoading,
    isError,
  } = useGetCitiesQuery(queryParams);

  const [deleteCity] = useDeleteCityMutation();

  // Memoize stable handlers to prevent column recreation
  const handleEdit = useCallback((city: City) => {
    setSelectedCity(city);
    setOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedCity(null);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteCity(id)
        .unwrap()
        .then((response) => {
          toast.success(response.message || "City deleted successfully");
        })
        .catch((error) => {
          toast.error(error.data?.message || "Failed to delete city");
        });
    },
    [deleteCity]
  );

  // Update pagination metadata when response changes
  useEffect(() => {
    if (response?.meta) {
      updatePaginationMeta(response.meta);
    }
  }, [response?.meta, updatePaginationMeta]);

  const cityData = response?.data ?? [];

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(
    () =>
      getCityColumns({
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

  // Memoize table configuration
  const tableConfig = useMemo(
    () => ({
      fixedColumns: {
        left: ["id", "name"],
        right: ["actions"],
      },
    }),
    []
  );

  // Memoize filter components
  const filterComponents = useMemo(
    () => <CityFilter filters={filters} onFilterChange={handleFilterChange} />,
    [filters, handleFilterChange]
  );

  // Memoize trigger button
  const triggerButton = useMemo(
    () => <Button onClick={handleAdd}>Add City</Button>,
    [handleAdd]
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Cities"
        columns={columns}
        data={cityData}
        meta={response?.meta}
        // searchColumns={searchColumns}
        loading={cityLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search cities by name..."
        searchValue={searchTerm}
        filterComponents={filterComponents}
        module="city"
        trigger={triggerButton}
        tableConfig={tableConfig}
      />

      {selectedCity ? (
        <EditCity city={selectedCity} open={open} setOpen={setOpen} />
      ) : (
        <AddCity open={open} setOpen={setOpen} />
      )}
    </>
  );
}
