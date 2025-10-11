"use client";
import { useState, useEffect } from "react";
import { AdornedInput } from "./AdornedInput";

interface TaxDiscountInputProps {
  percentageValue: number | null;
  amountValue: number | null;
  onPercentageChange: (val: number | null) => void;
  onAmountChange: (val: number | null) => void;
  readOnlyAmount?: boolean;
  disabled?: boolean;
}

export function TaxDiscountInput({
  percentageValue,
  amountValue,
  onPercentageChange,
  onAmountChange,
  readOnlyAmount,
  disabled,
}: TaxDiscountInputProps) {
  const [percInput, setPercInput] = useState(percentageValue?.toString() ?? "");
  const [amtInput, setAmtInput] = useState(amountValue?.toString() ?? "");

  useEffect(() => {
    setPercInput(percentageValue?.toString() ?? "");
  }, [percentageValue]);

  useEffect(() => {
    setAmtInput(amountValue?.toString() ?? "");
  }, [amountValue]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <AdornedInput
        type="text"
        value={percInput}
        prefix="%"
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*\.?\d*$/.test(val)) {
            setPercInput(val);
            onPercentageChange(val === "" ? null : Number(val));
          }
        }}
      />
      <AdornedInput
        type="text"
        value={amtInput}
        prefix="₹"
        disabled={disabled}
        readOnly={readOnlyAmount}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*\.?\d*$/.test(val)) {
            setAmtInput(val);
            onAmountChange(val === "" ? null : Number(val));
          }
        }}
      />
    </div>
  );
}
