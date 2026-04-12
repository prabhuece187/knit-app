import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import type { ColumnDef } from "@tanstack/react-table";
import { ServerDataTableColumnHeader } from "@/components/custom/ServerDataTableColumnHeader";
import { reviewSchema, type Review } from "../schema-types/review.schema";
import { Badge } from "@/components/ui/badge";
import { formatDate, statusBadgeVariant, statusLabel } from "@/utility/utility";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

interface GetReviewColumnsProps {
  onEdit: (review: Review) => void;
  onView: (review: Review) => void;
  onDelete: (id: number) => void;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function getReviewColumns({
  onEdit,
  onView,
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
            className="capitalize"
            variant={statusBadgeVariant(status)}
          >
            {statusLabel(status)}
          </Badge>
        );
      },
    },

    {
      accessorKey: "isTestimonial",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Is Testimonial" sortable={false} />
      ),
      cell: ({ row }) => {
        const isTestimonial = row.getValue("isTestimonial") as boolean;
        return (
          <Badge
            className="capitalize"
            variant={isTestimonial ? "default" : "outline"}
          >
            {isTestimonial ? "Yes" : "No"}
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
        <div className="flex items-center gap-2">

          <DataTableRowActions<Review>
            row={row}
            onEdit={(item) => {
              onEdit(item);
            }}

            onDelete={(item) => {
              if (item.id) {
                onDelete(Number(item.id));
              }
            }}
          />
          <div>
            <Button variant="outline" size="sm" onClick={() => onView(row.original)}>
              <EyeIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ),
    },
  ];
}

export const searchColumns = reviewSchema.keyof().options as (keyof Review)[];
