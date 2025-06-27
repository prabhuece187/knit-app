"use client"

import { MoreHorizontal } from "lucide-react"

import { 
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger, 
} from "../../../components/ui/dropdown-menu"
import type { Row } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { customerSchema } from "@/app/schema-types/master-schema"
import { Button } from "../../../components/ui/button"

interface DataTableRowActionsProps {
  row: Row<customerSchema>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
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
        <Link to={`/edit-customer/${customer.id}`}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
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
