"use client";

import { useDispatch, useSelector } from "react-redux";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetItemListQuery } from "@/api/ItemApi";
import type { RootState, AppDispatch } from "@/store/Store";
import { addItemRow } from "@/slice/InvoiceFormSlice";
import type { Item } from "@/schema-types/master-schema";
import { InvoiceRowComponent } from "./InvoiceRowComponent";

interface InvoiceRowError {
  [field: string]: string; // e.g., quantity, price, item_id, description
}

interface InvoiceDetailsTableProps {
  rowErrors?: Record<number, InvoiceRowError>;
}

export function InvoiceDetailsTable({ rowErrors }: InvoiceDetailsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: items = [] } = useGetItemListQuery("") as { data: Item[] };

  const invoiceDetails = useSelector(
    (state: RootState) => state.invoiceForm.invoice_details
  );

  return (
    <div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">NO.</TableHead>
            <TableHead className="w-[400px]">ITEMS</TableHead>
            <TableHead className="w-[100px]">HSN</TableHead>
            <TableHead className="w-[100px]">QTY</TableHead>
            <TableHead className="w-[120px]">PRICE/ITEM</TableHead>
            <TableHead className="w-[100px]">DISCOUNT</TableHead>
            <TableHead className="w-[100px]">TAX</TableHead>
            <TableHead className="w-[120px]">AMOUNT</TableHead>
            <TableHead className="w-[60px] text-center">
              <Button
                type="button"
                className="p-2"
                onClick={() =>
                  dispatch(
                    addItemRow({
                      invoice_id: 0,
                      item_id: 0,
                      item_description: "",
                      hsn_code: "",
                      quantity: 0,
                      price: 0,
                      item_discount_per: null,
                      item_discount_amount: null,
                      item_tax_per: null,
                      item_tax_amount: null,
                      amount: 0,
                      // lastEdited: undefined,
                      discountSource: undefined,
                    })
                  )
                }
              >
                <IconPlus className="h-5 w-5" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceDetails.map((row, index) => (
            <InvoiceRowComponent
              // Using a composite key with `id` and `index` is more robust
              // It handles cases where you add new items without an ID yet
              key={`${row.item_id ?? "new"}-${index}`}
              index={index}
              items={items}
              rowError={rowErrors?.[index]}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
