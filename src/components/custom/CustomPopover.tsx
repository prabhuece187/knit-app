"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import DynamicAdd from "../common/DynamicAdd";
import { Controller, type Control, type FieldPath } from "react-hook-form";

type SelectOption = Record<string, string | number>;

interface SelectPopoverProps<
  TOption extends SelectOption,
  TFormValues extends Record<string, unknown> = Record<string, unknown>
> {
  label: string;
  options: TOption[];
  valueKey: keyof TOption;
  labelKey: keyof TOption;
  value?: number;
  onValueChange?: (val: number) => void;
  placeholder?: string;
  hideLabel?: boolean;
  control?: Control<TFormValues>;
  name?: FieldPath<TFormValues>;
}

export function SelectPopover<
  TOption extends SelectOption,
  TFormValues extends Record<string, unknown> = Record<string, unknown>
>({
  label,
  options,
  valueKey,
  labelKey,
  value,
  onValueChange,
  placeholder = "Select...",
  hideLabel,
  control,
  name,
}: SelectPopoverProps<TOption, TFormValues>) {
  const [open, setOpen] = useState(false);

  const renderPopover = (
    val: number | undefined,
    setVal: (v: number) => void
  ) => {
    const selected = options.find((opt) => opt[valueKey] === val);

    return (
      <div>
        {!hideLabel && <label className="text-sm font-medium">{label}</label>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              role="combobox"
            >
              {selected?.[labelKey] ?? placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
              <CommandList>
                <CommandEmpty>
                  No {label.toLowerCase()} found. <DynamicAdd label={label} />
                </CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={String(opt[valueKey])}
                      value={String(opt[labelKey])}
                      onSelect={() => setVal(opt[valueKey] as number)}
                    >
                      {opt[labelKey]}
                      <Check
                        className={cn(
                          "ml-auto",
                          val === opt[valueKey] ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  // React Hook Form integration
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          renderPopover(field.value as number | undefined, field.onChange)
        }
      />
    );
  }

  // Manual usage fallback
  return renderPopover(value, (val) => onValueChange?.(val));
}
