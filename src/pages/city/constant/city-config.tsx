import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { citySchema, type City } from "../schema-types/city-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { ServerDataTableColumnHeader } from "@/components/custom/ServerDataTableColumnHeader";


interface GetCityColumnsProps {
  onEdit: (city: City) => void;
  onDelete: (id: number) => void;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function getCityColumns({
  onEdit,
  onDelete,
  currentSortBy,
  currentSortOrder,
  onSortChange,
}: GetCityColumnsProps): ColumnDef<City>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="ID"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="City Name"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "districtId",
      header: ({ column }) => (
        <ServerDataTableColumnHeader
          column={column}
          title="District"
          sortable={true}
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSortChange={onSortChange}
        />
      ),
      cell: ({ row }) => {
        const city = row.original;
        const districtName = city.district?.name;
        const districtCode = city.district?.districtCode;

        return (
          <div className="text-sm">
            {districtName ? (
              <div>
                <div className="font-medium">{districtName}</div>
                {/* {districtCode && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {districtCode}
                    </Badge>
                  </div>
                )} */}
              </div>
            ) : (
              <div className="text-muted-foreground">
                District ID: {city.districtId}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "state",
      header: () => <div>State</div>,
      cell: ({ row }) => {
        const city = row.original;
        const stateName = city.district?.state?.name;
        const stateCode = city.district?.state?.stateCode;

        return (
          <div className="text-sm">
            {stateName ? (
              <div>
                <div className="font-medium">{stateName}</div>
                {/* {stateCode && (
                  <div className="text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {stateCode}
                    </Badge>
                  </div>
                )} */}
              </div>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
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
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="font-medium">Actions</div>
      ),
      cell: ({ row }) => (
        <DataTableRowActions<City>
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
      ),
    },
  ];
}

export const searchColumns = citySchema.keyof().options as (keyof City)[];
