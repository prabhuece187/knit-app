import type React from "react";
import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import CommonHeader from "../common/CommonHeader";
import { EnhancedDataTable } from "./EnhancedDataTable";
import { DataTablePagination } from "../common/DataTablePagination";

import { DataTableSearch } from "./DataTableSearch";
import { DataTableFilters } from "./DataTableFilters";
import { DataTableControls } from "./DataTableControls";

import type { PaginationMeta } from "@/schema-types/pagination-schema";
import type { TableModuleConfig } from "@/config/table.config";
import { useEnhancedTable } from "@/hooks/useEnhancedTable";

interface EnhancedDataTableCardProps<T> {
  name: string;
  loading: boolean;
  isError: boolean;

  columns: ColumnDef<T>[];
  data: T[];
  meta?: PaginationMeta;

  trigger?: React.ReactNode;

  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onSearchChange?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;

  filterComponents?: React.ReactNode;
  module?: string;
  tableConfig?: Partial<TableModuleConfig>;
}

function EnhancedDataTableCard<T extends object>({
  name,
  loading,
  isError,
  columns,
  data,
  meta,
  trigger,

  onPageChange,
  onLimitChange,
  onSearchChange,

  searchPlaceholder,
  searchValue = "",

  filterComponents,
  module = "default",
  tableConfig,
}: EnhancedDataTableCardProps<T>) {
  /* ---------------- Search (Server-Side) ---------------- */
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (!onSearchChange) return;

    const timer = setTimeout(() => {
      onSearchChange(localSearchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchValue, onSearchChange]);

  /* ---------------- Pagination Safety ---------------- */
  const pageIndex = meta ? meta.page - 1 : 0;
  const pageSize = meta?.limit ?? 10;
  const pageCount = meta?.totalPages ?? 1;

  /* ---------------- Table Hook (Server Mode) ---------------- */
  const { table, mergedConfig } = useEnhancedTable({
    data,
    columns,
    module,
    tableConfig,
    pageIndex,
    pageSize,
    pageCount,
    onPageChange: onPageChange ?? (() => { }),
  });

  console.log("isError", isError);

  return (
    <>
      <CommonHeader name={name} trigger={trigger} />

      <div className="space-y-4">
        {(mergedConfig.enableSearch ||
          mergedConfig.enableFilters ||
          mergedConfig.enableColumnVisibility) && (
            <div className="flex items-center gap-2">
              <DataTableSearch
                searchValue={localSearchValue}
                onSearchChange={setLocalSearchValue}
                placeholder={searchPlaceholder}
                config={mergedConfig}
              />

              <DataTableFilters
                filterComponents={filterComponents}
                config={mergedConfig}
              />

              <DataTableControls table={table} config={mergedConfig} />
            </div>
          )}

        {loading ? (
          <div className="flex justify-center py-8 text-muted-foreground">
            Loading...
          </div>
        ) : isError ? (
          <div className="flex justify-center py-8 text-red-500">
            Failed to load data
          </div>
        ) : (
          <>
            <EnhancedDataTable table={table} showPagination={false} />

            {meta && onPageChange && onLimitChange && (
              <DataTablePagination
                meta={meta}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default EnhancedDataTableCard;
