import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { type District } from "../schema-types/district-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export function getDistrictColumns(
  handleEdit: (id: number) => void,
  handleDelete: (id: number) => void
): ColumnDef<District>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="District Name" />
      ),
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "districtCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="District Code" />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="font-mono">
            {row.getValue("districtCode")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "stateId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ),
      cell: ({ row }) => {
        const district = row.original;
        const stateName = district.state?.name;
        // const stateCode = district.state?.stateCode;

        return (
          <div className="text-sm">
            {stateName ? (
              <div>
                <div className="font-medium">{stateName}</div>
                {/* {stateCode && (
                  <div className="text-xs text-muted-foreground">
                    {stateCode}
                  </div>
                )} */}
              </div>
            ) : (
              <div className="text-muted-foreground">
                State ID: {district.stateId}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions<District>
          row={row}
          onEdit={(item) => {
            handleEdit(Number(item.id));
          }}
          onDelete={(item) => {
            if (item.id) {
              handleDelete(Number(item.id));
            }
          }}
        />
      ),
    },
  ];
}
