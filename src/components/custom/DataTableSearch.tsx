import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import type { TableModuleConfig } from "@/config/table.config";

interface DataTableSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  config: TableModuleConfig;
}

export const DataTableSearch = React.memo<DataTableSearchProps>(
  ({ searchValue, onSearchChange, placeholder, config }) => {
    if (!config.enableSearch) return null;

    return (
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || config.searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    );
  }
);

DataTableSearch.displayName = "DataTableSearch";
