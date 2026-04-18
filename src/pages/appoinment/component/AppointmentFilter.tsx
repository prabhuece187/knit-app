import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";
import { useDebounce } from "@/helper/useDebounce";
import { useGetProfessionalsQuery } from "@/pages/professional/api/ProfessionalApi";
import { useCallback, useState } from "react";
import { PAGINATION_CONFIG } from "@/config/app.config";
import { toIdNameOptions } from "@/utility/option-utils";
import type { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/common/DateRangePicker";
import { format } from "date-fns";

interface AppointmentFilterProps {
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const MEETING_TYPE_OPTIONS = [
  { label: "In Person", value: "IN_PERSON" },
  { label: "Online", value: "ONLINE" },
  { label: "Phone", value: "PHONE" },
];

export default function AppointmentFilter({
  filters,
  onFilterChange,
}: AppointmentFilterProps) {

  const [searchTerm, setSearchTerm] = useState("");
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleStatusChange = useCallback(
    (values: string[]) => {
      onFilterChange({
        ...filters,
        status: values.length > 0 ? values[0] : "",
      });
    },
    [filters, onFilterChange],
  );

  const handleMeetingTypeChange = useCallback(
    (values: string[]) => {
      onFilterChange({
        ...filters,
        meetingType: values.length > 0 ? values[0] : "",
      });
    },
    [filters, onFilterChange],
  );

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const { data: professionalsResponse } = useGetProfessionalsQuery({
    page: PAGINATION_CONFIG.DEFAULT_PAGE,
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
    name: debouncedSearchTerm || undefined,
  });

  const baseProfessionals = toIdNameOptions(professionalsResponse?.data);

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

  const handleDateRangeChange = useCallback(
    (nextRange?: DateRange) => {
      setRange(nextRange);

      const dateFrom = nextRange?.from ? format(nextRange.from, "yyyy-MM-dd") : "";
      const dateTo = nextRange?.to ? format(nextRange.to, "yyyy-MM-dd") : "";
      onFilterChange({
        ...filters,
        dateFrom,
        dateTo,
      });
    },
    [filters, onFilterChange],
  );

  const showReset = !!(filters.status || filters.meetingType || filters.professionalId || filters.dateFrom || filters.dateTo);

  return (
    <div className="flex gap-2">
      <ServerFacetedFilter
        title="Status"
        options={STATUS_OPTIONS}
        selectedValues={filters.status ? [filters.status] : []}
        onValueChange={handleStatusChange}
        searchPlaceholder="Status..."
        singleSelect
      />

      <ServerFacetedFilter
        title="Meeting type"
        options={MEETING_TYPE_OPTIONS}
        selectedValues={filters.meetingType ? [filters.meetingType] : []}
        onValueChange={handleMeetingTypeChange}
        searchPlaceholder="Meeting type..."
        singleSelect
      />

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

      <DateRangePicker
        value={range}
        onChange={handleDateRangeChange}
        noInitialDate
      />

      <ResetFiltersButton
        show={showReset}
        onReset={() => {
          setRange(undefined);
          onFilterChange({
            ...filters,
            status: "",
            meetingType: "",
            professionalId: "",
            dateFrom: "",
            dateTo: "",
          });
        }}
      />
    </div>
  );
}
