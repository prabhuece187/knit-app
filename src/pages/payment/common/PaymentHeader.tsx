"use client";
import { SelectPopover } from "@/components/custom/CustomPopover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Customer } from "@/schema-types/master-schema";
import type {
  PaymentFormFields,
  PaymentFormState,
} from "@/schema-types/paymennt-schema";
import { updateField } from "@/slice/PaymentFormSlice";
import type { AppDispatch } from "@/store/Store";
import { useDispatch } from "react-redux";

type PaymentField = keyof PaymentFormState;

type PaymentHeaderOnChange = <K extends PaymentField>(
  field: K,
  value: PaymentFormState[K]
) => void;

export default function PaymentHeader({
  data,
  // onChange,
  customers,
  errors,
}: {
  data: PaymentFormState;
  onChange: PaymentHeaderOnChange;
  customers: Customer[];
  errors?: Record<string, string>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (
    field: PaymentFormFields,
    value: string | number | null | undefined
  ) => {
    dispatch(
      updateField({
        field,
        value: value === null ? undefined : value,
      })
    );
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
      <h2 className="text-lg font-bold mb-3 text-gray-800 border-b pb-2">
        Payment Details
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
        {/* Customer */}
        <div className="space-y-1 col-span-2 md:col-span-1">
          <SelectPopover
            label="Customer"
            placeholder="Select customer..."
            options={customers}
            valueKey="id"
            labelKey="customer_name"
            value={data.customer_id ?? 0}
            onValueChange={(val) => handleChange("customer_id", val)}
          />
          {errors?.customer_id && (
            <p className="text-red-600 text-xs mt-1">{errors.customer_id}</p>
          )}
        </div>

        {/* Payment Date */}
        <div className="space-y-1 col-span-1">
          <label className="text-sm font-medium text-gray-700">
            Payment Date
          </label>
          <Input
            type="date"
            value={data.payment_date}
            onChange={(e) => handleChange("payment_date", e.target.value)}
          />
          {errors?.payment_date && (
            <p className="text-red-600 text-xs mt-1">{errors.payment_date}</p>
          )}
        </div>

        {/* Payment Type */}
        <div className="space-y-1 col-span-1">
          <label className="text-sm font-medium text-gray-700">
            Payment Type
          </label>
          <Select
            value={data.payment_type}
            onValueChange={(v) => handleChange("payment_type", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="neft">NEFT</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="rtgs">RTGS</SelectItem>
            </SelectContent>
          </Select>
          {errors?.payment_type && (
            <p className="text-red-600 text-xs mt-1">{errors.payment_type}</p>
          )}
        </div>

        {/* Total Amount */}
        <div className="space-y-1 col-span-1">
          <label className="text-sm font-medium text-gray-700">
            Total Amount
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={data.total_amount}
            onChange={(e) =>
              handleChange("total_amount", Number(e.target.value))
            }
          />
          {errors?.total_amount && (
            <p className="text-red-600 text-xs mt-1">{errors.total_amount}</p>
          )}
        </div>

        {/* Reference No */}
        <div className="space-y-1 col-span-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Reference No
          </label>
          <Input
            type="text"
            placeholder="Cheque No / UTR No..."
            value={data.reference_no}
            onChange={(e) => handleChange("reference_no", e.target.value)}
          />
        </div>

        {/* Note */}
        <div className="space-y-1 col-span-2 md:col-span-4">
          <label className="text-sm font-medium text-gray-700">Note</label>
          <Input
            type="text"
            placeholder="Any remarks..."
            value={data.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
