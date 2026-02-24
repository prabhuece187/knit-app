import React from "react";
import { Filter } from "lucide-react";
import type { TableModuleConfig } from "@/config/table.config";

interface DataTableFiltersProps {
  filterComponents?: React.ReactNode;
  config: TableModuleConfig;
}

export const DataTableFilters = React.memo<DataTableFiltersProps>(
  ({ filterComponents, config }) => {
    if (!config.enableFilters || !filterComponents) return null;

    return (
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center space-x-2">{filterComponents}</div>
      </div>
    );
  }
);

DataTableFilters.displayName = "DataTableFilters";
