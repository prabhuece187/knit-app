import { PAGINATION_CONFIG } from "@/config/app.config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAppointmentsQuery } from "@/pages/appoinment/api/AppointmentApi";
import type { Appointment, AppointmentQueryParams } from "@/pages/appoinment/schema-types/appointment.schema";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
// import "@fullcalendar/core/index.css";
import dayGridPlugin from "@fullcalendar/daygrid";
// import "@fullcalendar/daygrid/index.css";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
// import "@fullcalendar/timegrid/index.css";
import { addMinutes } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./professional-calendar.css";
import { useDataTable } from "@/hooks/useDataTable";
import { blurActiveElement } from "@/utility/utility";
import ViewAppointment from "./ViewAppointment";
import { useAppSelector } from "@/store/Store";
import { useGetProfessionalByUserIdQuery } from "@/pages/professional/api/ProfessionalApi";
import ProfessionalCalendarFilter from "./ProfessionalCalendarFilter";

function dateOnlyFromAppointment(raw: string): string {
    if (raw.includes("T")) return raw.split("T")[0] ?? raw.slice(0, 10);
    return raw.slice(0, 10);
}

function parseTimeParts(time: string): { hours: number; minutes: number } {
    const t = time.trim();
    const m24 = /^(\d{1,2}):(\d{2})/.exec(t);
    if (m24) {
        return { hours: Number(m24[1]), minutes: Number(m24[2]) };
    }
    const m12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(t);
    if (m12) {
        let h = Number(m12[1]);
        const min = Number(m12[2]);
        const ap = m12[3].toUpperCase();
        if (ap === "PM" && h !== 12) h += 12;
        if (ap === "AM" && h === 12) h = 0;
        return { hours: h, minutes: min };
    }
    return { hours: 9, minutes: 0 };
}

function appointmentToEvent(appointment: Appointment): EventInput {
    const dateOnly = dateOnlyFromAppointment(appointment.appointmentDate);
    const [y, m, d] = dateOnly.split("-").map(Number);
    const year = y ?? 1970;
    const month = (m ?? 1) - 1;
    const day = d ?? 1;

    const duration =
        appointment.duration && appointment.duration > 0 ? appointment.duration : 60;

    const title =
        appointment.serviceType?.trim() ||
        appointment.visitor?.name?.trim() ||
        "Appointment";

    const statusClass = `fc-event-status-${appointment.status.toLowerCase()}`;

    if (!appointment.appointmentTime?.trim()) {
        return {
            id: String(appointment.id),
            title,
            start: dateOnly,
            allDay: true,
            extendedProps: { appointment },
            classNames: [statusClass],
        };
    }

    const { hours, minutes } = parseTimeParts(appointment.appointmentTime);
    const start = new Date(year, month, day, hours, minutes, 0, 0);
    const end = addMinutes(start, duration);

    return {
        id: String(appointment.id),
        title,
        start,
        end,
        extendedProps: { appointment },
        classNames: [statusClass],
    };
}

export default function ProfessionalCalendar() {
    const calendarRef = useRef<FullCalendar>(null);

    const authUserId = useAppSelector((state) => state.auth.user?.id);

    const {
        data: professionalData,
        isLoading: professionalLoading,
        isError: professionalError,
    } = useGetProfessionalByUserIdQuery(authUserId, { skip: !authUserId });

    const [openView, setOpenView] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
        null,
    );

    const {
        filters,
        handleFilterChange,
        queryParams,
    } = useDataTable<AppointmentQueryParams, Appointment>({
        searchField: "serviceType",
        initialSortBy: "appointmentDate",
        initialSortOrder: "desc",
    });

    const professionalId = professionalData?.id?.toString() ?? "";
    const dateFrom = filters.dateFrom?.trim() ?? "";


    const handleView = useCallback((appointment: Appointment) => {
        blurActiveElement();
        setSelectedAppointment(appointment);
        setOpenView(true);
    }, []);

    const {
        data, isLoading, isFetching, isError
    } = useGetAppointmentsQuery(queryParams, { skip: !professionalId },);


    const events = useMemo(() => {
        const rows = data?.data ?? [];
        return rows.map(appointmentToEvent);
    }, [data?.data]);

    const total = data?.meta?.total ?? 0;
    const capped = total > PAGINATION_CONFIG.MAX_LIMIT;

    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (!api || !dateFrom) return;
        api.gotoDate(dateFrom);
    }, [dateFrom, professionalId]);

    const handleEventClick = useCallback(
        (arg: EventClickArg) => {
            const appointment = arg.event.extendedProps.appointment as Appointment | undefined;
            if (appointment && handleView) {
                handleView(appointment);
            }
        },
        [handleView],
    );

    if (!authUserId) {
        return (
            <Card className="mt-6 border-muted/80 shadow-none">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-muted-foreground size-5" />
                        <CardTitle className="text-base">Professional schedule</CardTitle>
                    </div>
                    <CardDescription>Sign in to view your appointment calendar.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (professionalLoading) {
        return (
            <Card className="mt-6 border-muted/80 shadow-none">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-muted-foreground size-5" />
                        <CardTitle className="text-base">Professional schedule</CardTitle>
                    </div>
                    <CardDescription>Loading your schedule…</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (professionalError) {
        return (
            <Card className="mt-6 border-muted/80 shadow-none">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-muted-foreground size-5" />
                        <CardTitle className="text-base">Professional schedule</CardTitle>
                    </div>
                    <CardDescription className="text-destructive">
                        Could not load your professional profile. Try again later.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!professionalId) {
        return (
            <Card className="mt-6 border-muted/80 shadow-none">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-muted-foreground size-5" />
                        <CardTitle className="text-base">Professional schedule</CardTitle>
                    </div>
                    <CardDescription>
                        No professional profile is linked to this account, so the calendar cannot be shown.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <>

            <Card className="professional-calendar mt-6 border-muted/80 shadow-none">
                <CardHeader className="pb-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="text-muted-foreground size-5" />
                                <CardTitle className="text-base">Appoinments</CardTitle>
                            </div>
                            <CardDescription className="mt-1">
                                {capped
                                    ? ` Showing up to ${PAGINATION_CONFIG.MAX_LIMIT} appointments; total in range is ${total}.`
                                    : null}
                            </CardDescription>

                        </div>
                        <div className="flex justify-end">
                            <ProfessionalCalendarFilter
                                filters={filters}
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                        {(isLoading || isFetching) && (
                            <span className="text-muted-foreground text-sm">Updating…</span>
                        )}
                        {isError && (
                            <span className="text-destructive text-sm">Could not load appointments.</span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="fc-theme-standard min-h-[520px] w-full overflow-hidden rounded-lg border border-border">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            buttonText={{
                                today: "Today",
                                month: "Month",
                                week: "Week",
                                day: "Day",
                            }}
                            height="auto"
                            editable={false}
                            selectable={false}
                            dayMaxEvents={3}
                            events={events}
                            eventClick={handleEventClick}
                            nowIndicator
                            slotMinTime="06:00:00"
                            slotMaxTime="22:00:00"
                            initialDate={dateFrom || undefined}
                        />
                    </div>
                </CardContent>
            </Card >
            {selectedAppointment && (
                <ViewAppointment
                    appointment={selectedAppointment}
                    open={openView}
                    setOpen={setOpenView}
                />
            )
            }
        </>
    );
}
