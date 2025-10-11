import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Assuming this input can handle left/right adornments or we can style it.
import type {
  Control,
  Path,
  // UseFormSetValue
} from "react-hook-form";
import type { FieldValues } from "react-hook-form";

// Helper component for styled inputs with a prefix/suffix
interface AdornedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  suffix?: string;
}

const AdornedInput = ({
  prefix,
  suffix,
  className,
  ...props
}: AdornedInputProps) => {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-2 text-sm text-gray-500 pointer-events-none">
          {prefix}
        </span>
      )}
      <Input
        className={`w-full ${prefix ? "pl-8" : ""} ${
          suffix ? "pr-8" : ""
        } ${className}`}
        {...props}
      />
      {suffix && (
        <span className="absolute right-2 text-sm text-gray-500 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
};

// Updated PriceInput - uses AdornedInput for '₹' prefix
export function PriceInput<TFormValues extends FieldValues>({
  control,
  name,
  label,
  onValueChange,
  readOnly = false,
}: {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  onValueChange: (value: number) => void;
  readOnly?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <AdornedInput
              type="number"
              prefix="₹"
              placeholder={label}
              {...field}
              readOnly={readOnly}
              value={field.value ?? ""} // Ensure controlled component
              onChange={(e) => {
                field.onChange(e);
                if (!readOnly) onValueChange(+e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Updated TaxDiscountInput - now has "%" suffix for percentage and "₹" prefix for amount
export function TaxDiscountInput<TFormValues extends FieldValues>({
  control,
  percentageName,
  amountName,
  percentageLabel,
  onPercentageChange,
  // readOnlyAmount = true,
}: {
  control: Control<TFormValues>;
  percentageName: Path<TFormValues>;
  amountName: Path<TFormValues>;
  percentageLabel: string;
  onPercentageChange: (value: number) => void;
  readOnlyAmount?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {" "}
      {/* Use w-full to make them fill the cell */}
      <FormField
        control={control}
        name={percentageName}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <AdornedInput
                type="number"
                placeholder={percentageLabel}
                prefix="%" // Suffix for percentage
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e);
                  onPercentageChange(+e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={amountName}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <AdornedInput
                type="number"
                prefix="₹" // Prefix for amount
                // readOnly={readOnlyAmount}
                placeholder="0"
                value={field.value ?? 0}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
