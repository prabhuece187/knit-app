import { useMemo } from "react";
import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "../common/DataTablePagination";
import {
  createColumnStyleGetter,
  type FixedColumnsConfig,
} from "@/lib/table-utils";
import type { PaginationMeta } from "@/schema-types/pagination-schema";

interface EnhancedDataTableProps<TData> {
  table: TanStackTable<TData>;
  showPagination?: boolean;
  enableHorizontalScroll?: boolean;
  fixedColumns?: FixedColumnsConfig;
  className?: string;

  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function EnhancedDataTable<TData>({
  table,
  showPagination = true,
  enableHorizontalScroll = false,
  fixedColumns,
  className = "",
  paginationMeta,
  onPageChange,
  onLimitChange,
}: EnhancedDataTableProps<TData>) {
  const getColumnStyle = useMemo(
    () => createColumnStyleGetter(fixedColumns),
    [fixedColumns],
  );
  const tableContainerClass = enableHorizontalScroll ? "overflow-x-auto" : "";

  return (
    <div className={`${className}`}>
      <div className={`rounded-md border ${tableContainerClass}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={getColumnStyle(header.column.id)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-left"
                      style={getColumnStyle(cell.column.id)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && paginationMeta && onPageChange && onLimitChange && (
        <DataTablePagination
          meta={paginationMeta}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
