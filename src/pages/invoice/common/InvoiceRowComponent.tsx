"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconTrash, IconScan } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { PriceInput } from "./PriceInput";
import { TaxDiscountInput } from "./TaxDiscountInput";
import {
  removeItemRow,
  updateItemRow,
  selectIsItemDiscountDisabled,
} from "@/slice/InvoiceFormSlice";
import { calculateRow } from "@/utility/invoice-utils";
import { selectCalculatedRows } from "@/utility/invoice-selectors";
import type { AppDispatch } from "@/store/Store";
import type { Item } from "@/schema-types/master-schema";
import type { InvoiceRowRedux } from "@/schema-types/invoice-detail";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BarcodeScanner from "@/components/common/BarcodeScanner";

interface InvoiceRowComponentProps {
  index: number;
  items: Item[];
}

export const InvoiceRowComponent: React.FC<InvoiceRowComponentProps> =
  React.memo(({ index, items }) => {
    const dispatch = useDispatch<AppDispatch>();

    // Scanner modal
    const [scannerOpen, setScannerOpen] = React.useState(false);

    const calculatedRows = useSelector(selectCalculatedRows);
    const currentRow = calculatedRows[index];
    const isItemDiscountDisabled = useSelector(selectIsItemDiscountDisabled);

    // Normalize discountSource
    const normalizeDiscountSource = (
      value: unknown
    ): "bill" | "item" | undefined =>
      value === "bill" || value === "item" ? value : undefined;

    // Update row + recalc
    const handleReduxUpdate = <K extends keyof InvoiceRowRedux>(
      field: K,
      value: InvoiceRowRedux[K]
    ) => {
      const updatedRow = {
        ...currentRow,
        [field]:
          field === "discountSource" ? normalizeDiscountSource(value) : value,
      } as InvoiceRowRedux;

      // Handle lastEdited
      if (field === "item_discount_per") updatedRow.lastEdited = "discountPer";
      if (field === "item_discount_amount")
        updatedRow.lastEdited = "discountAmt";

      if (field === "item_tax_per") updatedRow.lastEdited = "taxPer";
      if (field === "item_tax_amount") updatedRow.lastEdited = "taxAmt";

      const recalculated = calculateRow(updatedRow);
      dispatch(updateItemRow({ index, changes: recalculated }));
    };

    // 🟢 Barcode / QR Code Scan Handler
    const handleScan = (code: string) => {
      setScannerOpen(false);

      const found = items.find((i) => i.barcode === code || i.qrcode === code);

      if (!found) {
        alert("Item not found");
        return;
      }

      // If already selected → increase qty
      if (currentRow.item_id === found.id) {
        handleReduxUpdate("quantity", (currentRow.quantity ?? 0) + 1);
        return;
      }

      // Otherwise fill all fields
      dispatch(
        updateItemRow({
          index,
          changes: {
            item_id: found.id,
            item_description: found.description ?? "",
            hsn_code: found.hsn_code ?? "",
            price: found.price ?? 0,
          },
        })
      );
    };

    // 🔥 UI STARTS HERE
    return (
      <>
        <TableRow>
          <TableCell>{index + 1}</TableCell>

          {/* ITEM */}
          <TableCell className="w-[400px]">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <SelectPopover
                  label="Item"
                  placeholder="Select Item..."
                  options={items}
                  valueKey="id"
                  labelKey="item_name"
                  value={currentRow.item_id}
                  hideLabel
                  onValueChange={(val) => {
                    const selectedItem = items.find((i) => i.id === val);
                    if (!selectedItem) return;

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
                  placeholder="Enter Description"
                  value={currentRow.item_description ?? ""}
                  onChange={(e) =>
                    handleReduxUpdate("item_description", e.target.value)
                  }
                />
              </div>

              {/* SCAN BUTTON */}
              <Button
                type="button"
                variant="secondary"
                className="h-10"
                onClick={() => setScannerOpen(true)}
              >
                <IconScan size={20} />
              </Button>
            </div>
          </TableCell>

          {/* HSN */}
          <TableCell className="w-[100px]">
            <Input
              value={currentRow.hsn_code ?? ""}
              onChange={(e) => handleReduxUpdate("hsn_code", e.target.value)}
            />
          </TableCell>

          {/* QTY */}
          <TableCell className="w-[80px]">
            <Input
              type="number"
              className="text-right"
              value={currentRow.quantity ?? 0}
              onChange={(e) =>
                handleReduxUpdate("quantity", Number(e.target.value))
              }
            />
          </TableCell>

          {/* PRICE */}
          <TableCell className="w-[100px]">
            <Input
              type="number"
              className="text-right"
              value={currentRow.price ?? 0}
              onChange={(e) =>
                handleReduxUpdate("price", Number(e.target.value))
              }
            />
          </TableCell>

          {/* DISCOUNT */}
          <TableCell className="w-[100px]">
            <TaxDiscountInput
              percentageValue={currentRow.item_discount_per ?? 0}
              amountValue={currentRow.item_discount_amount ?? 0}
              disabled={isItemDiscountDisabled}
              onPercentageChange={(v) =>
                handleReduxUpdate("item_discount_per", Number(v))
              }
              onAmountChange={(v) =>
                handleReduxUpdate("item_discount_amount", Number(v))
              }
            />
          </TableCell>

          {/* TAX */}
          <TableCell className="w-[100px]">
            <TaxDiscountInput
              percentageValue={currentRow.item_tax_per ?? 0}
              amountValue={currentRow.item_tax_amount ?? 0}
              onPercentageChange={(v) =>
                handleReduxUpdate("item_tax_per", Number(v))
              }
              onAmountChange={(v) =>
                handleReduxUpdate("item_tax_amount", Number(v))
              }
            />
          </TableCell>

          {/* AMOUNT */}
          <TableCell className="w-[120px]">
            <PriceInput
              mode="manual"
              value={currentRow.amount ?? 0}
              disabled
              onValueChange={() => {}}
            />
          </TableCell>

          {/* DELETE BUTTON */}
          <TableCell className="w-[60px] text-center">
            <Button
              variant="destructive"
              className="p-2"
              onClick={() => dispatch(removeItemRow(index))}
            >
              <IconTrash className="h-5 w-5" />
            </Button>
          </TableCell>
        </TableRow>

        {/* 🔍 SCANNER POPUP */}
        <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Scan Barcode / QR Code</DialogTitle>
            </DialogHeader>

            <BarcodeScanner onResult={handleScan} />
          </DialogContent>
        </Dialog>
      </>
    );
  });

InvoiceRowComponent.displayName = "InvoiceRowComponent";
