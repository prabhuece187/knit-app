import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { ServerDataTableColumnHeader } from "@/components/custom/ServerDataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, statusBadgeVariant, statusLabel } from "@/utility/utility";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import type { Appointment } from "../schema-types/appointment.schema";
import { appointmentSchema } from "../schema-types/appointment.schema";

interface GetAppointmentColumnsProps {
  onEdit: (appointment: Appointment) => void;
  onView: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function getAppointmentColumns({
  onEdit,
  onView,
  onDelete,
  currentSortBy,
  currentSortOrder,
  onSortChange,
}: GetAppointmentColumnsProps): ColumnDef<Appointment>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="ID"
          sortable={false}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "appointmentDate",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="Date"
          sortable
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(String(row.getValue("appointmentDate")))}
        </div>
      ),
    },
    {
      accessorKey: "professionalId",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Professional ID" sortable={false} />
      ),
      cell: ({ row }) => <div className="text-sm tabular-nums">{row.getValue("professionalId")}</div>,
    },
    {
      accessorKey: "visitorId",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Visitor ID" sortable={false} />
      ),
      cell: ({ row }) => (
        <div className="text-sm tabular-nums">{String(row.getValue("visitorId") ?? "—")}</div>
      ),
    },
    {
      accessorKey: "meetingType",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Meeting type" sortable={false} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {String(row.getValue("meetingType") ?? "").toLowerCase().replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Status" sortable={false} />
      ),
      cell: ({ row }) => {
        const status = String(row.getValue("status") ?? "PENDING");
        return (
          <Badge variant={statusBadgeVariant(status)}>
            {statusLabel(status, APPOINTMENT_STATUS_LABELS)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "serviceType",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Service" sortable={false} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[180px] truncate text-sm">{String(row.getValue("serviceType") ?? "—")}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="font-medium">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DataTableRowActions<Appointment>
            row={row}
            onEdit={(item) => onEdit(item)}
            onDelete={(item) => {
              if (item.id != null) onDelete(Number(item.id));
            }}
          />
          <Button variant="outline" size="sm" onClick={() => onView(row.original)}>
            <EyeIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}

export const searchColumns = appointmentSchema.keyof().options as (keyof Appointment)[];
