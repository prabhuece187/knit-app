import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";
import { useCallback } from "react";

interface FaqFilterProps {
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

const CATEGORY_OPTIONS = [
  { label: "Visitor", value: "VISITOR" },
  { label: "Professional", value: "PROFESSIONAL" },
];

const PUBLIC_OPTIONS = [
  { label: "Public", value: "true" },
  { label: "Private", value: "false" },
];

export default function FaqFilter({ filters, onFilterChange }: FaqFilterProps) {
  const handleCategoryChange = useCallback(
    (values: string[]) => {
      onFilterChange({
        ...filters,
        category: values.length > 0 ? values[0] : "",
      });
    },
    [filters, onFilterChange],
  );

  const handlePublicChange = useCallback(
    (values: string[]) => {
      onFilterChange({
        ...filters,
        isPublic: values.length > 0 ? values[0] : "",
      });
    },
    [filters, onFilterChange],
  );

  const showReset = !!(filters.category || filters.isPublic);

  return (
    <>
      <ServerFacetedFilter
        title="Category"
        options={CATEGORY_OPTIONS}
        selectedValues={filters.category ? [filters.category] : []}
        onValueChange={handleCategoryChange}
        searchPlaceholder="Category..."
        singleSelect
      />

      <ServerFacetedFilter
        title="Visibility"
        options={PUBLIC_OPTIONS}
        selectedValues={filters.isPublic ? [filters.isPublic] : []}
        onValueChange={handlePublicChange}
        searchPlaceholder="Visibility..."
        singleSelect
      />

      <ResetFiltersButton
        show={showReset}
        onReset={() =>
          onFilterChange({
            ...filters,
            category: "",
            isPublic: "",
          })
        }
      />
    </>
  );
}
