import type { DistrictFilterProps } from '../schema-types/district-schema';
import { ServerFacetedFilter } from '@/components/custom/ServerFacetedFilter';
import { useCallback, useState } from 'react';
import { PAGINATION_CONFIG } from '@/config/app.config';
import { useGetStateQuery } from '@/pages/state/api/StateApi';
import { useDebounce } from '@/helper/useDebounce';
import ResetFiltersButton from '@/components/common/ResetFiltersButton';

const DistrictFilter = ({ filters, onFilterChange }: DistrictFilterProps) => {

    const [stateSearch, setStateSearch] = useState("");
    const debouncedStateSearch = useDebounce(stateSearch, 300);

    // Use paginated states query with debounced search
    const { data: statesResponse } = useGetStateQuery({
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
        sortBy: "name",
        sortOrder: "asc",
        name: debouncedStateSearch || undefined,
    });

    const isSingleSelect = true;

    const handleTypeFilterChange = useCallback(
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


    return (
        <>
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
                onValueChange={handleTypeFilterChange}
                onSearchChange={setStateSearch}
                searchValue={stateSearch}
                searchPlaceholder="Search State..."
                singleSelect={isSingleSelect}
            />

            <ResetFiltersButton
                show={!!filters.stateId}
                onReset={() =>
                    onFilterChange({
                        stateId: "",
                    })
                }
            />
        </>
    )
}

export default DistrictFilter