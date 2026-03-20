import * as React from "react";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export interface FacetedFilterOption {
  label: string;
  value: string | undefined;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface ServerFacetedFilterProps {
  title?: string;
  options: FacetedFilterOption[];
  selectedValues?: string[];
  onValueChange?: (values: string[]) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  className?: string;
  singleSelect?: boolean;
  disabled?: boolean;
}

export function ServerFacetedFilter({
  title,
  options,
  selectedValues = [],
  onValueChange,
  onSearchChange,
  searchValue = "",
  searchPlaceholder,
  className,
  singleSelect = false,
  disabled = false,
}: ServerFacetedFilterProps) {
  const [open, setOpen] = React.useState(false);
  const selectedSet = new Set(selectedValues);

  const handleSelect = (value: string) => {
    if (singleSelect) {
      // Single select mode: replace selection or clear if clicking the same item
      const newValues = selectedSet.has(value) ? [] : [value];
      onValueChange?.(newValues);
    } else {
      // Multi-select mode: toggle selection
      const newSelectedSet = new Set(selectedSet);
      if (newSelectedSet.has(value)) {
        newSelectedSet.delete(value);
      } else {
        newSelectedSet.add(value);
      }

      const newValues = Array.from(newSelectedSet);
      onValueChange?.(newValues);
    }
  };

  const handleClear = () => {
    onValueChange?.([]);
    setOpen(false);
    onSearchChange?.("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 border-dashed", className)}
          disabled={disabled}
        >
          <PlusCircle />
          {title}
          {selectedSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedSet.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedSet.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedSet.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => option.value && selectedSet.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={!onSearchChange}>
          <CommandInput
            placeholder={searchPlaceholder ?? title}
            value={searchValue}
            onValueChange={onSearchChange}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value && selectedSet.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => option.value && handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[4px] border",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input [&_svg]:invisible"
                      )}
                    >
                      <Check className="size-3.5" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground size-4" />
                    )}
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
