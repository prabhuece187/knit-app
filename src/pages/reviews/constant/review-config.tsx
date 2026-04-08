import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import { ServerDataTableColumnHeader } from "@/components/custom/ServerDataTableColumnHeader";
import { reviewSchema, type Review } from "../schema-types/review.schema";
import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utility/utility";


interface GetReviewColumnsProps {
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function getReviewColumns({
  onEdit,
  onDelete,
  currentSortBy,
  currentSortOrder,
  onSortChange,
}: GetReviewColumnsProps): ColumnDef<Review>[] {
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
      cell: ({ row }) => <div className="w-[50px]" > {row.getValue("id")} </div>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="Review Title"
          sortable={false}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="Rating"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="Message"
          sortable={false}
        />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Status" sortable={false} />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={status === "PENDING" ? "default" : "outline"}
            className="capitalize"
          >
            {status === "PENDING" ? "Pending" : status === "APPROVED" ? "Approved" : status === "REJECTED" ? "Rejected" : status === "COMPLETE" ? "Complete" : status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="Created At"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(date)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="font-medium" > Actions </div>
      ),
      cell: ({ row }) => (
        <DataTableRowActions<Review>
          row={row}
          onEdit={(item) => {
            onEdit(item);
          }
          }
          onDelete={(item) => {
            if (item.id) {
              onDelete(Number(item.id));
            }
          }}
        />
      ),
    },
  ];
}

export const searchColumns = reviewSchema.keyof().options as (keyof Review)[];
