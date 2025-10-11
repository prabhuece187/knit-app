"use client";

import { Input } from "@/components/ui/input";
import { SelectPopover } from "@/components/custom/CustomPopover";
import type { Customer } from "@/schema-types/master-schema";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/slice/InvoiceFormSlice";
import type { RootState, AppDispatch } from "@/store/Store";
import type { InvoiceFormFields } from "@/schema-types/invoice-schema";
// Assuming this selector calculates the due date based on invoice_date and payment_terms
import { selectDueDate } from "@/utility/invoice-selectors";

interface CustomerInvoiceHeaderProps {
  customers: Customer[];
  errors?: Record<string, string>;
}

export function CustomerInvoiceHeader({
  customers,
  errors,
}: CustomerInvoiceHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const invoiceForm = useSelector((state: RootState) => state.invoiceForm);

  const calculatedDueDate = useSelector(selectDueDate);

  const handleChange = (
    field: InvoiceFormFields,
    value: string | number | boolean | null | undefined
  ) => {
    dispatch(updateField({ field, value }));
  };

  const calculateDaysDifference = (
    startDateStr: string,
    endDateStr: string
  ): number | null => {
    if (!startDateStr || !endDateStr) return null;

    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);

      // Reset time component to ensure accurate day difference (important for dates)
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Calculate the difference in milliseconds
      const diffTime = end.getTime() - start.getTime();

      // Convert milliseconds to days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    } catch (error) {
      console.error("Date difference calculation failed:", error);
      return null;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ... Left Side ... */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="p-4 border rounded">
          <SelectPopover
            label="Customer"
            placeholder="Select customer..."
            options={customers}
            valueKey="id"
            labelKey="customer_name"
            value={invoiceForm.customer_id ?? 0}
            onValueChange={(val) => handleChange("customer_id", val ?? 0)}
          />
          {errors?.customer_id && (
            <span className="text-red-500 text-sm">{errors.customer_id}</span>
          )}
        </div>
      </div>

      {/* ... Right Side ... */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="p-4 border rounded grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Invoice Number</label>
            <Input
              placeholder="Number"
              value={invoiceForm.invoice_number}
              onChange={(e) => handleChange("invoice_number", e.target.value)}
            />
            {errors?.invoice_number && (
              <span className="text-red-500 text-sm">
                {errors.invoice_number}
              </span>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={invoiceForm.invoice_date}
              onChange={(e) => handleChange("invoice_date", e.target.value)}
            />
          </div>

          {/* Payment Terms (Days) - FIX 2: Send null for empty value */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Payment Terms (Days)
            </label>
            <Input
              type="number"
              placeholder="terms days"
              value={invoiceForm.payment_terms ?? ""}
              onChange={(e) =>
                handleChange(
                  "payment_terms",
                  // If input is empty string, send NULL to Redux
                  e.target.value ? Number(e.target.value) : null
                )
              }
            />
          </div>

          {/* Due Date - FIX 1: Display calculated date (selectDueDate) */}
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              // Display the calculated due date if available, otherwise use the stored date.
              // This logic depends on the selector, assuming it manages calculation priority.
              value={calculatedDueDate ?? invoiceForm.due_date ?? ""}
              // If the user manually changes the date, update the raw state (due_date)
              onChange={(e) => {
                const newDueDate = e.target.value || null;
                const invoiceDate = invoiceForm.invoice_date;
                // Send NULL if the date input is cleared
                handleChange("due_date", e.target.value || null);

                if (newDueDate && invoiceDate) {
                  const days = calculateDaysDifference(invoiceDate, newDueDate);

                  // 3. Dispatch the calculated days to payment_terms
                  if (days !== null) {
                    handleChange("payment_terms", days);
                  }
                } else if (!newDueDate) {
                  // If Due Date is cleared, clear Payment Terms too
                  handleChange("payment_terms", null);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
