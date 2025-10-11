"use client";

import { AdornedInput } from "./AdornedInput";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { Control, FieldValues, Path } from "react-hook-form";

// --------------------
// RHF props
// --------------------
interface PriceInputRHFProps<TFormValues extends FieldValues> {
  mode: "rhf";
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  onValueChange?: (value: number) => void;
  readOnly?: boolean;
  value?: never;
}

// --------------------
// Manual / Redux props
// --------------------
interface PriceInputManualProps {
  mode: "manual";
  value: number;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onValueChange: (value: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  control?: never;
  name?: never;
  label?: never;
}

// --------------------
// Combined type
// --------------------
type PriceInputProps<TFormValues extends FieldValues = FieldValues> =
  | PriceInputRHFProps<TFormValues>
  | PriceInputManualProps;

export function PriceInput<TFormValues extends FieldValues = FieldValues>(
  props: PriceInputProps<TFormValues>
) {
  if (props.mode === "rhf") {
    const { control, name, onValueChange, readOnly = false } = props;
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
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e);
                  onValueChange?.(+e.target.value);
                }}
                readOnly={readOnly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Manual / Redux mode
  const { value, onValueChange, readOnly = false } = props;
  return (
    <AdornedInput
      type="number"
      prefix="₹"
      value={value}
      onChange={(e) => onValueChange(+e.target.value)}
      readOnly={readOnly}
    />
  );
}
