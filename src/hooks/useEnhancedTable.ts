import { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import {
  getTableModuleConfig,
  type TableModuleConfig,
} from "@/config/table.config";

export interface UseEnhancedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];

  module?: string;
  tableConfig?: Partial<TableModuleConfig>;

  // ✅ SERVER PAGINATION
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function useEnhancedTable<T extends object>({
  data,
  columns,
  module = "default",
  tableConfig,

  pageIndex,
  pageSize,
  pageCount,
  onPageChange,
}: UseEnhancedTableProps<T>) {


  /* ---------------- Module Config Merge ---------------- */
  const mergedConfig = useMemo(() => {
    const base = getTableModuleConfig(module);
    return { ...base, ...tableConfig };
  }, [module, tableConfig]);

  /* ---------------- Column Visibility ---------------- */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  /* ---------------- React Table ---------------- */
  const table = useReactTable({
    data,
    columns,

    // ✅ SERVER MODE
    pageCount,
    manualPagination: true,

    state: {
      columnVisibility,
      pagination: {
        pageIndex,
        pageSize,
      },
    },

    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      // Backend is 1-based indexing
      onPageChange(next.pageIndex + 1);
    },

    onColumnVisibilityChange: setColumnVisibility,

    // ✅ Only core rows (no client filtering)
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    mergedConfig,
    columnVisibility,
    setColumnVisibility,
  };
}
