"use client";

import { Input } from "@/components/ui/input";

interface AdornedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AdornedInput = ({
  prefix,
  suffix,
  className,
  ...props
}: AdornedInputProps) => {
  return (
    <div className="relative flex items-center w-full">
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
