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
import { ChevronsUpDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import DynamicAdd from "../common/DynamicAdd";
import { Controller, type Control, type FieldPath } from "react-hook-form";

type SelectOption = Record<string, string | number | boolean>;


interface SelectPopoverProps<
  TOption extends SelectOption,
  TFormValues extends Record<string, unknown> = Record<string, unknown>
> {
  label: string;
  options: TOption[];
  valueKey: keyof TOption;
  labelKey: keyof TOption;
  value?: number;
  onValueChange?: (val: number | undefined) => void;
  placeholder?: string;
  hideLabel?: boolean;
  control?: Control<TFormValues>;
  name?: FieldPath<TFormValues>;
  onSearchChange?: (searchTerm: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
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
  onSearchChange,
  name,
  showClearButton = true,
  onClear,
}: SelectPopoverProps<TOption, TFormValues>) {
  const [open, setOpen] = useState(false);

  const renderPopover = (
    val: number | undefined,
    setVal: (v: number | undefined) => void
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
              <div className="flex items-center">
                {showClearButton && val != null && (
                  <div
                    className="h-6 w-6 p-0 mr-1 hover:bg-muted rounded-sm flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVal(undefined);
                      onValueChange?.(undefined);
                      onSearchChange?.("");
                      setOpen(false);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </div>
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} onValueChange={onSearchChange} />
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
