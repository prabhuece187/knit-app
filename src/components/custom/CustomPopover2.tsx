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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import DynamicAdd from "../common/DynamicAdd";

// Generic option type (you can customize this more if needed)
type SelectOption = Record<string, string | number | boolean>;

interface SelectPopoverProps<
    TFieldValues extends FieldValues,
    TOption extends SelectOption
> {
    label?: string;
    placeholder?: string;
    options: TOption[];
    valueKey: keyof TOption;
    labelKey: keyof TOption;
    name: FieldPath<TFieldValues>;
    control: Control<TFieldValues>;
    hideLabel?: boolean;
    onValueChange?: (selected: TOption) => void;
    onSearchChange?: (searchTerm: string) => void;
    onClear?: () => void;
    showClearButton?: boolean;
}

export function SelectPopover<
    TFieldValues extends FieldValues,
    TOption extends SelectOption
>({
    label,
    placeholder = "Select...",
    options,
    valueKey,
    labelKey,
    name,
    control,
    onValueChange,
    onSearchChange,
    hideLabel = false,
    showClearButton = true,
    onClear,
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
                        {!hideLabel && label && <FormLabel>{label}</FormLabel>}
                        <Popover open={open} onOpenChange={setOpen} modal={true}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between"
                                    >
                                        {selected?.[labelKey] ?? placeholder}
                                        <div className="flex items-center">
                                            {showClearButton && field.value && (
                                                <div
                                                    className="h-6 w-6 p-0 mr-1 hover:bg-muted rounded-sm flex items-center justify-center cursor-pointer"
                                                    onClick={(e) => {
                                                        console.log("clear button clicked");
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        field.onChange(null);
                                                        onClear?.();                                      // ✅ notify parent
                                                        onValueChange?.(undefined as unknown as TOption);
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
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-[300px] p-0 z-[100]"
                            // onInteractOutside={(e) => {
                            //   // Prevent the dialog from closing when interacting with the popover
                            //   e.preventDefault();
                            // }}
                            >
                                <Command>
                                    <CommandInput
                                        placeholder={
                                            label ? `Search ${label.toLowerCase()}...` : "Search..."
                                        }
                                        onValueChange={onSearchChange}
                                        className="h-9"
                                    />
                                    <CommandList className="max-h-[200px]">
                                        <CommandEmpty>
                                            {label
                                                ? `No ${label.toLowerCase()} found.`
                                                : "No options found."}{" "}
                                            {label && <DynamicAdd label={label} />}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {options.map((opt) => (
                                                <CommandItem
                                                    key={String(opt[valueKey])}
                                                    value={String(opt[labelKey])}
                                                    onSelect={(currentValue) => {
                                                        const selectedOption = options.find(
                                                            (o) => String(o[labelKey]) === currentValue
                                                        );
                                                        if (selectedOption) {
                                                            field.onChange(selectedOption[valueKey]);
                                                            onValueChange?.(selectedOption);
                                                        }
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
