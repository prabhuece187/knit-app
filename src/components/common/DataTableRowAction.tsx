"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import type { Row } from "@tanstack/react-table";
import { useLocation } from "react-router-dom";

export interface DataTableRowActionsProps<T> {
  row: Row<T>;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onPrint?: (row: T) => void;
  extraActions?: React.ReactNode;
}

export function DataTableRowActions<T extends { id?: number | string }>({
  row,
  onEdit,
  onDelete,
  onPrint,
  extraActions = null,
}: DataTableRowActionsProps<T>) {
  const location = useLocation();
  const item = row.original;

  // Avoid rendering if ID is missing
  //  if (item.id === undefined || item.id === null) {
  //    console.warn("Missing ID for row:", item);
  //  }
  if (!item.id) return null;
  const isInvoicePage = location.pathname.includes("invoice");

  console.log("its run nice ", isInvoicePage);
  console.log("its run nice ", onPrint);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
        )}

        {/* 👇 Show only on Invoice page */}

        {isInvoicePage && onPrint && (
          <DropdownMenuItem onClick={() => onPrint(item)}>
            Print
          </DropdownMenuItem>
        )}
        {extraActions}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(item)}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
