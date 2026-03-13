import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { Table } from "@tanstack/react-table";
import type { VisibilityState } from "@tanstack/react-table";

interface ColumnVisibilityToggleProps<TData> {
  table: Table<TData>;
  columnVisibility?: VisibilityState;
}

export function ColumnVisibilityToggle<TData>({
  table,
  columnVisibility,
}: ColumnVisibilityToggleProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter((column) => column.id !== "actions");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <ChevronDown className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              // checked={column.getIsVisible()}

              checked={columnVisibility?.[column.id] !== false}
              onCheckedChange={(value) => {
                column.toggleVisibility(!!value);

                // table.setColumnVisibility((prev) => ({
                //   ...prev,
                //   [column.id]: value === true,
                // }));
              }}
              onSelect={(e) => e.preventDefault()}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}