import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ServerDataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  sortable?: boolean;
  currentSortBy?: string;
  currentSortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function ServerDataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  sortable = true,
  currentSortBy,
  currentSortOrder,
  onSortChange,
}: ServerDataTableColumnHeaderProps<TData, TValue>) {
  const columnId = column.id;
  const isSorted = currentSortBy === columnId;
  const sortDirection = isSorted ? currentSortOrder : null;

  // If not sortable, just return the title
  if (!sortable) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSort = (order: "asc" | "desc") => {
    if (onSortChange) {
      onSortChange(columnId, order);
    } else {
      // Fallback to client-side sorting if no handler provided
      column.toggleSorting(order === "desc");
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {sortDirection === "desc" ? (
              <ArrowDown className="text-muted-foreground" />
            ) : sortDirection === "asc" ? (
              <ArrowUp className="text-muted-foreground" />
            ) : (
              <ChevronsUpDown className="text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort("asc")}>
            <ArrowUp />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("desc")}>
            <ArrowDown />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
