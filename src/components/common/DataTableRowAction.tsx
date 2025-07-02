"use client"

import { MoreHorizontal } from "lucide-react"

import { 
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger, 
} from "../ui/dropdown-menu"
import type { Row } from "@tanstack/react-table"
import type { customerSchema } from "@/schema-types/master-schema"
import { Button } from "../ui/button"

interface DataTableRowActionsProps {
  row: Row<customerSchema>;
  setOpen: (open: boolean) => void;
  setSelectedCustomerId: (id: number) => void;
}

export function DataTableRowActions({ row,setOpen, setSelectedCustomerId  }: DataTableRowActionsProps) {
  const customer = row.original
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
          <DropdownMenuItem onClick={() => {
            setSelectedCustomerId(Number(customer.id));
            setOpen(true);
          }}>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
