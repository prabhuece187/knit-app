"use client"

import React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

import { Input } from "./input"
import { DataTablePagination } from "../../app/components/table/DataTablePagination"

interface DataTableProps<TData,TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchColumns: (keyof TData)[]
}

export function DataTable<TData,TValue>({
  columns,
  data,
  searchColumns,
}: DataTableProps<TData,TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("")

  // ✅ This filters across multiple columns
  const globalFilterFn: FilterFn<TData> = (row, _columnId, filterValue) => {
    return searchColumns.some((col) => {
      const value = row.getValue(col as string)
      return String(value ?? "")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    })
  }

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <div className="flex items-center py-2">
        <Input
          placeholder="Search Customer detail..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id} className="text-left">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>        
      </div>
      <DataTablePagination table={table} />
    </>
  )
}
