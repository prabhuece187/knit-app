import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { ServerDataTableColumnHeader } from "@/components/custom/ServerDataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utility/utility";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import type { Faq } from "../schema-types/faq.schema";
import { faqSchema } from "../schema-types/faq.schema";

interface GetFaqColumnsProps {
  onEdit: (faq: Faq) => void;
  onView: (faq: Faq) => void;
  onDelete: (id: number) => void;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function getFaqColumns({
  onEdit,
  onView,
  onDelete,
  currentSortBy,
  currentSortOrder,
  onSortChange,
}: GetFaqColumnsProps): ColumnDef<Faq>[] {
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
      accessorKey: "question",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Question" sortable={false} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[280px] truncate text-sm font-medium">
          {String(row.getValue("question") ?? "")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Category" sortable={false} />
      ),
      cell: ({ row }) => {
        const cat = row.getValue("category") as string;
        return (
          <Badge variant="secondary" className="capitalize">
            {cat?.toLowerCase() ?? "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isPublic",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Public" sortable={false} />
      ),
      cell: ({ row }) => {
        const pub = row.getValue("isPublic") as boolean;
        return (
          <Badge variant={pub ? "default" : "outline"}>{pub ? "Yes" : "No"}</Badge>
        );
      },
    },
    {
      accessorKey: "sortOrder",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="Order"
          sortable
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => <div className="text-sm tabular-nums">{row.getValue("sortOrder")}</div>,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <ServerDataTableColumnHeader column={column} title="Slug" sortable={false} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[160px] truncate font-mono text-xs text-muted-foreground">
          {String(row.getValue("slug") ?? "")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="Created"
          sortable
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm text-muted-foreground">{formatDate(date)}</div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="font-medium">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DataTableRowActions<Faq>
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

export const searchColumns = faqSchema.keyof().options as (keyof Faq)[];
