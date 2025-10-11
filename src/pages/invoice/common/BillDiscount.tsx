"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  toggleDiscountForm,
  updateBillDiscount,
  updateField,
} from "@/slice/InvoiceFormSlice";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import type { RootState, AppDispatch } from "@/store/Store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaxDiscountInput } from "./TaxDiscountInput";
import { selectInvoiceSubtotal } from "@/utility/invoice-selectors";

export default function BillDiscount() {
  const dispatch = useDispatch<AppDispatch>();
  const subtotal = useSelector(selectInvoiceSubtotal);

  const {
    show_discount_form,
    bill_discount_type,
    bill_discount_per,
    bill_discount_amount,
    invoice_details,
  } = useSelector((state: RootState) => state.invoiceForm);

  const hasItemDiscount = invoice_details.some(
    (item) =>
      (item.item_discount_amount ?? 0) > 0 && item.discountSource === "item"
  );

  const handleUpdate = (
    field: "bill_discount_per" | "bill_discount_amount",
    value: number | null
  ) => {
    if (hasItemDiscount) {
      alert(
        "Item-wise discount already applied. Remove them before applying bill-wise discount."
      );
      return;
    }

    if (!subtotal || subtotal <= 0) return;

    let billDiscountPer = bill_discount_per ?? 0;
    let billDiscountAmt = bill_discount_amount ?? 0;

    if (field === "bill_discount_per") {
      billDiscountPer = value ?? 0;
      billDiscountAmt = (billDiscountPer / 100) * subtotal;
    } else {
      billDiscountAmt = value ?? 0;
      billDiscountPer = subtotal ? (billDiscountAmt / subtotal) * 100 : 0;
    }

    dispatch(
      updateBillDiscount({
        billDiscountPer: billDiscountPer,
        billDiscountAmt: billDiscountAmt,
        lastEdited:
          field === "bill_discount_per" ? "billDiscountPer" : "billDiscountAmt",
      })
    );
  };

  const handleTypeChange = (value: string) => {
    const hasManualItemDiscount = invoice_details.some(
      (i) => (i.item_discount_amount ?? 0) > 0 && i.discountSource !== "bill"
    );

    if (hasManualItemDiscount) {
      alert(
        "Item-wise discount already applied. Remove them before applying bill-wise discount."
      );
      return;
    }

    dispatch(updateField({ field: "bill_discount_type", value }));
  };

  return (
    <div className="border p-4 rounded">
      {show_discount_form ? (
        <>
          <div className="flex justify-end">
            <Button
              className="m-1 px-1 h-4"
              variant="outline"
              size="sm"
              onClick={() => dispatch(toggleDiscountForm())}
            >
              x
            </Button>
          </div>

          <CardContent className="space-y-3">
            <div className="flex gap-2 items-end">
              <div className="flex flex-col gap-2">
                <Select
                  value={bill_discount_type ?? ""}
                  onValueChange={handleTypeChange}
                  disabled={hasItemDiscount}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before_tax">
                      Discount Before Tax
                    </SelectItem>
                    <SelectItem value="after_tax">
                      Discount After Tax
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 m-1">
                <TaxDiscountInput
                  percentageValue={bill_discount_per ?? null}
                  amountValue={bill_discount_amount ?? null}
                  onPercentageChange={(val) =>
                    handleUpdate("bill_discount_per", val)
                  }
                  onAmountChange={(val) =>
                    handleUpdate("bill_discount_amount", val)
                  }
                  readOnlyAmount={false}
                />
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => dispatch(toggleDiscountForm())}
          disabled={hasItemDiscount}
        >
          ➕ Add Discount
        </Button>
      )}
    </div>
  );
}
