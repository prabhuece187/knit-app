import { CommonDrawer } from "@/components/common/CommonDrawer";
import CommonHeader from "@/components/common/CommonHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, statusBadgeVariant, statusLabel } from "@/utility/utility";
import type { Appointment } from "../schema-types/appointment.schema";

interface ViewAppointmentProps {
  appointment: Appointment;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function ViewAppointment({
  appointment,
  open,
  setOpen,
}: ViewAppointmentProps) {
  const created = appointment.createdAt ? new Date(appointment.createdAt) : null;
  const updated = appointment.updatedAt ? new Date(appointment.updatedAt) : null;

  return (
    <CommonDrawer isOpen={open} onClose={() => setOpen(false)} side="right" size="md">
      <CommonHeader name="Appointment" />

      <Card className="border-muted/80 shadow-none">
        <CardHeader className="gap-3 pb-2 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {appointment.meetingType.toLowerCase().replace("_", " ")}
            </Badge>
            <Badge variant={statusBadgeVariant(appointment.status)}>
              {statusLabel(appointment.status, APPOINTMENT_STATUS_LABELS)}
            </Badge>
          </div>
          <h2 className="text-lg font-semibold leading-snug">
            {appointment.serviceType || "Appointment Details"}
          </h2>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Professional ID:</span>{" "}
              {appointment.professionalId}
            </p>
            <p>
              <span className="text-muted-foreground">Visitor ID:</span>{" "}
              {appointment.visitorId ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Date:</span>{" "}
              {formatDate(appointment.appointmentDate, "long")}
            </p>
            <p>
              <span className="text-muted-foreground">Time:</span>{" "}
              {appointment.appointmentTime || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Duration:</span>{" "}
              {appointment.duration ? `${appointment.duration} min` : "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Location:</span>{" "}
              {appointment.location || "—"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
              Notes
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {appointment.notes || "—"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Confirmed at:</span>{" "}
              {appointment.confirmedAt ? formatDate(appointment.confirmedAt, "long") : "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Confirmed by:</span>{" "}
              {appointment.confirmedBy || "—"}
            </p>
          </div>

          {appointment.cancelReason ? (
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                Cancel reason
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {appointment.cancelReason}
              </p>
            </div>
          ) : null}

          <Separator />

          <div className="text-muted-foreground grid gap-1 text-xs">
            <p>
              Created:{" "}
              {created && !Number.isNaN(created.getTime()) ? formatDate(created, "long") : "—"}
            </p>
            <p>
              Updated:{" "}
              {updated && !Number.isNaN(updated.getTime()) ? formatDate(updated, "long") : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </CommonDrawer>
  );
}
