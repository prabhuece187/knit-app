"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { PriceInput } from "./PriceInput";
import { TaxDiscountInput } from "./TaxDiscountInput";
import type { AppDispatch } from "@/store/Store";
import {
  removeItemRow,
  updateItemRow,
  selectIsItemDiscountDisabled,
} from "@/slice/InvoiceFormSlice";
import type { Item } from "@/schema-types/master-schema";
import type { InvoiceRowRedux } from "@/schema-types/invoice-detail";
import { calculateRow } from "@/utility/invoice-utils";
import { selectCalculatedRows } from "@/utility/invoice-selectors";

interface InvoiceRowError {
  [field: string]: string;
}

interface InvoiceRowComponentProps {
  index: number;
  items: Item[];
  rowError?: InvoiceRowError;
}

// Helper to ensure discountSource type
function normalizeDiscountSource(value: unknown): "bill" | "item" | undefined {
  if (value === "bill" || value === "item") return value;
  return undefined;
}

export const InvoiceRowComponent: React.FC<InvoiceRowComponentProps> =
  React.memo(({ index, items, rowError }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isItemDiscountDisabled = useSelector(selectIsItemDiscountDisabled);

    // Always read the current row from Redux
    const calculatedRows = useSelector(selectCalculatedRows);
    const currentRow = calculatedRows[index];

    // ---------------- Redux update ----------------
    const handleReduxUpdate = <TField extends keyof InvoiceRowRedux>(
      field: TField,
      value: InvoiceRowRedux[TField]
    ) => {
      // Build updated row
      const updatedRow: InvoiceRowRedux = {
        ...currentRow,
        [field]:
          field === "discountSource" ? normalizeDiscountSource(value) : value,
        discountSource:
          field === "discountSource"
            ? normalizeDiscountSource(value)
            : normalizeDiscountSource(currentRow.discountSource),
      };

      // Update lastEdited for discount or tax
      if (
        ["item_discount_per", "item_discount_amount"].includes(field as string)
      ) {
        updatedRow.lastEdited =
          field === "item_discount_per" ? "discountPer" : "discountAmt";
      } else if (
        ["item_tax_per", "item_tax_amount"].includes(field as string)
      ) {
        updatedRow.lastEdited = field === "item_tax_per" ? "taxPer" : "taxAmt";
      }

      // Recalculate derived fields
      const recalculatedRow = calculateRow(updatedRow);

      // Dispatch to Redux
      dispatch(updateItemRow({ index, changes: recalculatedRow }));
    };

    // ---------------- Handlers ----------------
    // const handleItemChange = (selected: Item | undefined) => {
    //   if (!selected) {
    //     handleReduxUpdate("item_id", 0);
    //     handleReduxUpdate("description", "");
    //     handleReduxUpdate("hsn_code", "");
    //     handleReduxUpdate("price", 0);
    //     return;
    //   }
    //   handleReduxUpdate("item_id", selected.id ?? 0);
    //   handleReduxUpdate("description", selected.description ?? "");
    //   handleReduxUpdate("hsn_code", selected.hsn_code ?? "");
    //   handleReduxUpdate("price", selected.price ?? 0);
    // };

    const handleDiscountUpdate = (
      field: "item_discount_per" | "item_discount_amount",
      val: number | null
    ) => {
      if (isItemDiscountDisabled) return;
      handleReduxUpdate(field, Number(val));
    };

    const handleTaxUpdate = (
      field: "item_tax_per" | "item_tax_amount",
      val: number | null
    ) => {
      handleReduxUpdate(field, Number(val));
    };

    // ---------------- JSX ----------------
    return (
      <TableRow>
        {/* NO */}
        <TableCell className="py-2">{index + 1}</TableCell>

        {/* ITEM + DESCRIPTION */}
        <TableCell className="w-[400px] py-2">
          <SelectPopover
            label="Item"
            placeholder="Select Item..."
            options={items}
            valueKey="id"
            labelKey="item_name"
            value={currentRow.item_id || undefined} // ensure correct type
            hideLabel
            onValueChange={(val: number | undefined) => {
              const selectedItem = items.find((i) => i.id === val);

              if (!selectedItem) {
                // If no item selected, reset fields
                dispatch(
                  updateItemRow({
                    index,
                    changes: {
                      item_id: 0,
                      item_description: "",
                      hsn_code: "",
                      price: 0,
                    },
                  })
                );
                return;
              }

              // Update Redux with selected item data
              dispatch(
                updateItemRow({
                  index,
                  changes: {
                    item_id: selectedItem.id,
                    item_description: selectedItem.description ?? "",
                    hsn_code: selectedItem.hsn_code ?? "",
                    price: selectedItem.price ?? 0,
                  },
                })
              );
            }}
          />
          <Input
            className="mt-2"
            placeholder="Enter Description (optional)"
            value={currentRow.item_description ?? ""}
            onChange={(e) =>
              handleReduxUpdate("item_description", e.target.value)
            }
          />
        </TableCell>

        {/* HSN */}
        <TableCell className="w-[100px] py-2">
          <Input
            placeholder="HSN"
            value={currentRow.hsn_code ?? ""}
            onChange={(e) => handleReduxUpdate("hsn_code", e.target.value)}
          />
        </TableCell>

        {/* QTY */}
        <TableCell className="w-[100px] py-2">
          <Input
            type="text"
            className="text-right"
            value={currentRow.quantity ?? 0}
            onChange={(e) =>
              handleReduxUpdate("quantity", Number(e.target.value))
            }
          />
          {rowError?.quantity && (
            <span className="text-red-500 text-xs">{rowError.quantity}</span>
          )}
        </TableCell>

        {/* PRICE */}
        <TableCell className="w-[120px] py-2">
          <Input
            type="text"
            className="text-right"
            value={currentRow.price ?? 0}
            onChange={(e) => handleReduxUpdate("price", Number(e.target.value))}
          />
          {rowError?.price && (
            <span className="text-red-500 text-xs">{rowError.price}</span>
          )}
        </TableCell>

        {/* DISCOUNT */}
        <TableCell className="w-[100px] py-2">
          <TaxDiscountInput
            percentageValue={currentRow.item_discount_per ?? 0}
            amountValue={currentRow.item_discount_amount ?? 0}
            disabled={isItemDiscountDisabled}
            onPercentageChange={(val) =>
              handleDiscountUpdate("item_discount_per", val)
            }
            onAmountChange={(val) =>
              handleDiscountUpdate("item_discount_amount", val)
            }
          />
        </TableCell>

        {/* TAX */}
        <TableCell className="w-[100px] py-2">
          <TaxDiscountInput
            percentageValue={currentRow.item_tax_per ?? 0}
            amountValue={currentRow.item_tax_amount ?? 0}
            onPercentageChange={(val) => handleTaxUpdate("item_tax_per", val)}
            onAmountChange={(val) => handleTaxUpdate("item_tax_amount", val)}
          />
        </TableCell>

        {/* AMOUNT */}
        <TableCell className="w-[120px] py-2">
          <PriceInput
            mode="manual"
            value={currentRow.amount ?? 0}
            onValueChange={() => {}}
            disabled
          />
        </TableCell>

        {/* DELETE */}
        <TableCell className="w-[60px] text-center">
          <Button
            type="button"
            variant="destructive"
            className="p-2"
            onClick={() => dispatch(removeItemRow(index))}
          >
            <IconTrash className="h-5 w-5" />
          </Button>
        </TableCell>
      </TableRow>
    );
  });

InvoiceRowComponent.displayName = "InvoiceRowComponent";
