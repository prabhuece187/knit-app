"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  addAdditionalCharge,
  removeAdditionalCharge,
  updateAdditionalCharge,
} from "@/slice/InvoiceFormSlice";
import { Button } from "@/components/ui/button";
import type { RootState, AppDispatch } from "@/store/Store";
import { selectIsAnyItemTaxApplied } from "@/utility/invoice-selectors";

interface AdditionalChargesTableProps {
  rowErrors?: Record<number, Record<string, string>>;
}

export function AdditionalChargesTable({ rowErrors }: AdditionalChargesTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const charges = useSelector(
    (state: RootState) => state.invoiceForm.additional_charges
  );

  // Selector for disabling the tax dropdown
  const isTaxDropdownDisabled = !useSelector(selectIsAnyItemTaxApplied);

  const handleChange = (
    index: number,
    // Note: The 'field' must match the property key in the Redux state.
    field:
      | "additional_charge_name"
      | "additional_charge_amount"
      | "tax_applicable",
    value: string | number
  ) => {
    let finalValue = value;

    // Logic to force 'none' if the tax dropdown is disabled
    if (field === "tax_applicable" && isTaxDropdownDisabled) {
      finalValue = "none";
    }

    // Dispatch the update. Redux Toolkit will handle the specific field update.
    dispatch(updateAdditionalCharge({ index, [field]: finalValue }));
  };

  const addAdditionalData = () => {
    dispatch(
      addAdditionalCharge({
        additional_charge_name: "",
        additional_charge_amount: 0,
        tax_applicable: "none",
      })
    );
  };

  const handleRemove = (index: number) => {
    dispatch(removeAdditionalCharge(index));
  };

  // Check if any charge is incomplete to disable the Add button
  const isAddDisabled = charges.some(
    (c) => !c.additional_charge_name || c.additional_charge_amount === 0
  );

  return (
    <div className="border p-4 rounded">
      {charges.length > 0 && (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2 text-right">Tax</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {charges.map((charge, i) => (
              <tr key={i}>
                {/* DESCRIPTION */}
                <td className="p-2">
                  <input
                    type="text"
                    className="border px-2 w-full"
                    value={charge.additional_charge_name}
                    onChange={(e) =>
                      handleChange(i, "additional_charge_name", e.target.value)
                    }
                  />
                  {rowErrors?.[i]?.additional_charge_name && (
                    <span className="text-red-500 text-sm">
                      {rowErrors[i].additional_charge_name}
                    </span>
                  )}
                </td>

                {/* AMOUNT (FIXED: Uses Redux state directly for value) */}
                <td className="p-2">
                  <input
                    type="text" // Changed to text to handle decimal input
                    step="0.01"
                    className="border px-2 w-28 text-right"
                    // Use the number value converted to a string from Redux state
                    value={charge.additional_charge_amount.toString()}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Allow empty string, or valid number format (0-9, single dot)
                      if (val === "" || /^\d*\.?\d*$/.test(val)) {
                        // Dispatch the update immediately
                        // Empty string is converted to 0 as the number value
                        handleChange(
                          i,
                          "additional_charge_amount",
                          val === "" ? 0 : Number(val)
                        );
                      }
                    }}
                  />
                  {rowErrors?.[i]?.additional_charge_amount && (
                    <span className="text-red-500 text-sm">
                      {rowErrors[i].additional_charge_amount}
                    </span>
                  )}
                </td>

                {/* TAX DROPDOWN */}
                <td className="p-2">
                  <select
                    className="border px-2 w-28"
                    value={charge.tax_applicable ?? "none"}
                    disabled={isTaxDropdownDisabled}
                    onChange={(e) =>
                      handleChange(i, "tax_applicable", e.target.value)
                    }
                  >
                    <option value="none">No Tax</option>
                    <option value="gst5">GST 5%</option>
                    <option value="gst12">GST 12%</option>
                    <option value="gst18">GST 18%</option>
                    <option value="gst28">GST 28%</option>
                  </select>
                </td>

                {/* REMOVE BUTTON */}
                <td className="p-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(i)}
                  >
                    X
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ADD BUTTON */}
      <div className="mt-2">
        <Button
          variant="outline"
          className="w-full"
          disabled={isAddDisabled}
          onClick={addAdditionalData}
        >
          ➕ Add Additional Charge
        </Button>
      </div>
    </div>
  );
}
