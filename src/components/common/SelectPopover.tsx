import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

// Generic option type (you can customize this more if needed)
type SelectOption = {
  [key: string]: string | number;
};

interface SelectPopoverProps<TFieldValues extends FieldValues, TOption extends SelectOption> {
  label: string;
  placeholder?: string;
  options: TOption[];
  valueKey: keyof TOption;
  labelKey: keyof TOption;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}

export function SelectPopover<TFieldValues extends FieldValues, TOption extends SelectOption>({
  label,
  placeholder = "Select...",
  options,
  valueKey,
  labelKey,
  name,
  control,
}: SelectPopoverProps<TFieldValues, TOption>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = options.find((opt) => opt[valueKey] === field.value);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selected?.[labelKey] ?? placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                  <CommandList>
                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={String(opt[valueKey])}
                          value={String(opt[labelKey])}
                          onSelect={() => {
                            field.onChange(opt[valueKey]);
                            setOpen(false);
                          }}
                        >
                          {opt[labelKey]}
                          <Check
                            className={cn(
                              "ml-auto",
                              field.value === opt[valueKey]
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
