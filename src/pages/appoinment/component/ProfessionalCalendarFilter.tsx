import ResetFiltersButton from "@/components/common/ResetFiltersButton";
import { ServerFacetedFilter } from "@/components/custom/ServerFacetedFilter";
import { useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/common/DateRangePicker";
import { format } from "date-fns";

interface ProfessionalCalendarFilterProps {
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
    { label: "Video Call", value: "VIDEO_CALL" },
    { label: "Phone Call", value: "PHONE_CALL" },
    { label: "Online", value: "ONLINE" },
];

export default function ProfessionalCalendarFilter({
    filters,
    onFilterChange,
}: ProfessionalCalendarFilterProps) {

    const [range, setRange] = useState<DateRange | undefined>(undefined);

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
        <div className="flex gap-2" >
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
