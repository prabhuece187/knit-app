import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { useDebounce } from "@/helper/useDebounce";
import { useGetProfessionalsQuery } from "@/pages/professional/api/ProfessionalApi";
import { toIdNameOptions } from "@/utility/option-utils";
import { useCallback, useState } from "react";

interface ReviewFilterProps {
    filters: Record<string, string>;
    onFilterChange: (filters: Record<string, string>) => void;
}

export default function ReviewFilter({ filters, onFilterChange }: ReviewFilterProps) {

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data: professionalsResponse } = useGetProfessionalsQuery({
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
        sortBy: "name",
        sortOrder: "asc",
        name: debouncedSearchTerm || undefined,
    });

    const baseProfessionals = toIdNameOptions(professionalsResponse?.data);

    const handleSearchChange = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const isSingleSelect = true;

    const handleProfessionalFilterChange = useCallback(
        (values: string[]) => {
            onFilterChange({
                ...filters,
                professionalId: isSingleSelect
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
                options={baseProfessionals?.map((professional) => ({
                    label: professional.name,
                    value: professional.id?.toString() ?? "",
                })) ?? []}
                selectedValues={
                    isSingleSelect
                        ? filters.professionalId
                            ? [filters.professionalId]
                            : []
                        : filters.professionalId
                            ? filters.professionalId.split(",").filter(Boolean)
                            : []
                }
                onValueChange={handleProfessionalFilterChange}
                onSearchChange={handleSearchChange}
                searchValue={searchTerm}
                searchPlaceholder="Search Professional..."
                singleSelect={true}
            />


            <ResetFiltersButton
                show={!!filters.professionalId}
                onReset={() =>
                    onFilterChange({
                        professionalId: "",
                    })
                }
            />

        </>
    )
}