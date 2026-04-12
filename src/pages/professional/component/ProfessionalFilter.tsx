import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
import { useGetCategoriesQuery } from "@/api/CategoryApi";
import { toIdNameOptions } from "@/utility/option-utils";
import { useCallback, useState } from "react";

interface ProfessionalFilterProps {
    filters: Record<string, string>;
    onFilterChange: (filters: Record<string, string>) => void;
}

export default function ProfessionalFilter({ filters, onFilterChange }: ProfessionalFilterProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedCategorySearch = useDebounce(searchTerm, 300);

    const { data: categories } = useGetCategoriesQuery({
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
        sortBy: "name",
        sortOrder: "asc",
        name: debouncedCategorySearch || undefined,
    });

    const baseCategoryOptions = toIdNameOptions(categories?.data);

    const handleSearchChange = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };


    const isSingleSelect = true;

    const handleCategoryFilterChange = useCallback(
        (values: string[]) => {
            onFilterChange({
                ...filters,
                categoryId: isSingleSelect
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
                title="Professional"
                options={baseCategoryOptions?.map((category) => ({
                    label: category.name,
                    value: category.id?.toString() ?? "",
                })) ?? []}
                selectedValues={
                    isSingleSelect
                        ? filters.categoryId
                            ? [filters.categoryId]
                            : []
                        : filters.categoryId
                            ? filters.categoryId.split(",").filter(Boolean)
                            : []
                }
                onValueChange={handleCategoryFilterChange}
                onSearchChange={handleSearchChange}
                searchValue={searchTerm}
                searchPlaceholder="Search Category..."
                singleSelect={true}
            />


            <ResetFiltersButton
                show={!!filters.categoryId}
                onReset={() =>
                    onFilterChange({
                        categoryId: "",
                    })
                }
            />

        </>
    )
}