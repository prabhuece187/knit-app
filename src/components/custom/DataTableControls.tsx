import React from "react";
import type { Table } from "@tanstack/react-table";
import type { VisibilityState } from "@tanstack/react-table";
import type { TableModuleConfig } from "@/config/table.config";
import { ColumnVisibilityToggle } from "./ColumnVisibilityToggle";

interface DataTableControlsProps<T> {
  table: Table<T>;
  config: TableModuleConfig;
  columnVisibility: VisibilityState;
}

function DataTableControlsInner<T>({
  table,
  config,
  columnVisibility,
}: DataTableControlsProps<T>) {
  if (!config.enableColumnVisibility) return null;

  return (
    <div className="flex items-center space-x-2 ml-auto">
      <div className="flex items-center">
        <ColumnVisibilityToggle table={table} columnVisibility={columnVisibility} />
      </div>
    </div>
  );
}

export const DataTableControls = React.memo(
  DataTableControlsInner,
) as typeof DataTableControlsInner;

// DataTableControls.displayName = "DataTableControls";