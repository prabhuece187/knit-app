import React, { useState, useMemo, useCallback } from "react";
import { useGetDistrictsQuery } from "@/pages/district/api/DistrictApi";
import { useGetStateQuery } from "@/pages/state/api/StateApi";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
import {
  cityFilterSchema,
  type CityFilterProps,
  type CityFilterFormData,
} from "../schema-types/city-schema";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function CityFilter({ filters, onFilterChange }: CityFilterProps) {

  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");

  const debouncedStateSearch = useDebounce(stateSearch, 300);
  const debouncedDistrictSearch = useDebounce(districtSearch, 300);

  // Use paginated states query with debounced search
  const { data: statesResponse } = useGetStateQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedStateSearch || undefined,
  });

  // Get districts with pagination and debounced search
  const { data: districtsResponse } = useGetDistrictsQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedDistrictSearch || undefined,
    stateId: filters.stateId ? Number(filters.stateId) : undefined,
  }, { skip: !filters.stateId });

  // const districts = useMemo(
  //   () =>
  //     districtsResponse?.data
  //       ?.filter((d) => d.id !== undefined)
  //       .map((d) => ({
  //         id: d.id as number,
  //         name: d.name,
  //       })) || [],
  //   [districtsResponse?.data]
  // );

  // const states = useMemo(
  //   () => statesResponse?.data || [],
  //   [statesResponse?.data]
  // );

  const form = useForm<CityFilterFormData>({
    resolver: zodResolver(cityFilterSchema),
  });

  const isSingleSelect = true;

  const handleStateFilterChange = useCallback(
    (values: string[]) => {
      onFilterChange({
        ...filters,
        stateId: isSingleSelect
          ? values.length > 0
            ? values[0]
            : ""
          : values.length > 0
            ? values.join(",")
            : "",
      });
    },
    [filters, onFilterChange]
  );

  const handleDistrictFilterChange = useCallback(
    (values: string[]) => {
      onFilterChange({
        ...filters,
        districtId: isSingleSelect
          ? values.length > 0
            ? values[0]
            : ""
          : values.length > 0
            ? values.join(",")
            : "",
      });
    },
    [filters, onFilterChange]
  );

  return (
    <FormProvider {...form}>
      <div className="flex items-center space-x-2">
        <ServerFacetedFilter
          title="State"
          options={statesResponse?.data?.map((state) => ({
            label: state.name,
            value: state.id?.toString() ?? "",
          })) ?? []}
          selectedValues={
            isSingleSelect
              ? filters.stateId
                ? [filters.stateId]
                : [] // Single select: wrap in array
              : filters.stateId
                ? filters.stateId.split(",").filter(Boolean)
                : [] // Multi-select: split by comma
          }
          onValueChange={handleStateFilterChange}
          onSearchChange={setStateSearch}
          searchValue={stateSearch}
          searchPlaceholder="Search State..."
          singleSelect={isSingleSelect}
        />

        <ServerFacetedFilter
          title="District"
          options={districtsResponse?.data?.map((district) => ({
            label: district.name,
            value: district.id?.toString() ?? "",
          })) ?? []}
          selectedValues={
            isSingleSelect
              ? filters.districtId
                ? [filters.districtId]
                : [] // Single select: wrap in array
              : filters.districtId
                ? filters.districtId.split(",").filter(Boolean)
                : [] // Multi-select: split by comma
          }
          onValueChange={handleDistrictFilterChange}
          onSearchChange={setDistrictSearch}
          searchValue={districtSearch}
          searchPlaceholder="Search State..."
          singleSelect={isSingleSelect}
          disabled={!filters.stateId}
        />


        {/* Active Filter Tags */}
        {(filters.stateId || filters.districtId) && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange({
                stateId: "",
                districtId: "",
              })}
              className="h-8 px-2 text-xs"
            >
              Reset <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </FormProvider>
  );
}

// Memoize with custom comparison to check filter values, not reference
export default React.memo(CityFilter, (prevProps, nextProps) => {
  // Compare filter values deeply
  const prevDistrictValue = prevProps.filters.districtId;
  const nextDistrictValue = nextProps.filters.districtId;
  const prevStateValue = prevProps.filters.stateId;
  const nextStateValue = nextProps.filters.stateId;

  // Only re-render if the filter values actually changed
  return (
    prevDistrictValue === nextDistrictValue && prevStateValue === nextStateValue
  );
});
