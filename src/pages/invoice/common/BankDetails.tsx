"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateField } from "@/slice/InvoiceFormSlice";

import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Bank } from "@/schema-types/master-schema";
import { usePutSetDefaultMutation } from "@/api/BankApi";

import EditBank from "@/pages/bank/component/EditBank";
import AddBank from "@/pages/bank/component/AddBank";
import { Edit } from "lucide-react";

interface BankDetailsProps {
  bank: Bank;
  banksData?: Bank[];
}

export function BankDetails({ bank, banksData = [] }: BankDetailsProps) {
  const dispatch = useDispatch();

  // Reactive banks list
  const [banksList, setBanksList] = useState<Bank[]>(banksData);

  // Default selected bank: the one passed or the default bank from list
  const [selectedBank, setSelectedBank] = useState<Bank | null>(
    bank ?? banksData.find((b) => b.is_default) ?? null
  );

  // Add/Edit Bank modal state
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // RTK Query mutation
  const [setDefaultBank] = usePutSetDefaultMutation();

  // Sync selected bank with Redux
  useEffect(() => {
    if (selectedBank) {
      dispatch(updateField({ field: "bank_id", value: selectedBank.id }));
    }
  }, [selectedBank, dispatch]);

  // Select a bank from popover
  const handleBankSelect = (b: Bank) => {
    setSelectedBank(b);
    setPopoverOpen(false);
  };

  const updateLocalBankState = (bankId: number) => {
    // Update banks list immutably
    const updatedBanks = banksList.map((b) => ({
      ...b,
      is_default: b.id === bankId,
    }));
    setBanksList(updatedBanks);

    // Update selected bank to full updated object
    const newSelectedBank = updatedBanks.find((b) => b.id === bankId) ?? null;
    setSelectedBank(newSelectedBank);

    // Update Redux
    if (newSelectedBank) {
      dispatch(updateField({ field: "bank_id", value: newSelectedBank.id }));
    }
  };

  // Set bank as default
  const handleSetDefault = async (bankId: number) => {
    try {
      // Call backend API
      const res = await setDefaultBank({
        id: bankId,
        is_default: true,
      }).unwrap();
      console.log("Default bank set:", res);
      updateLocalBankState(bankId);
    } catch (err) {
      console.error("Failed to set default bank:", err);
    }
  };

  const [popoverOpen, setPopoverOpen] = useState(false);

  if (!selectedBank) return null;

  return (
    <>
      <div className="p-4 border rounded mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-left">Bank Details</h3>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Change Bank Details
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4">
              <h4 className="font-medium mb-2">Select Bank</h4>

              <ScrollArea className="h-56 mb-3 border rounded">
                <div className="flex flex-col divide-y">
                  {banksList.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2 text-center">
                      No banks available
                    </p>
                  ) : (
                    banksList.map((b) => (
                      <div
                        key={b.id}
                        className={`flex items-center justify-between px-3 py-2 hover:bg-muted transition ${
                          b.id === selectedBank?.id ? "bg-muted/50" : ""
                        }`}
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleBankSelect(b)}
                        >
                          <div className="font-medium">{b.bank_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {b.account_holder_name}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Default Switch */}
                          <Switch
                            checked={!!b.is_default}
                            onCheckedChange={() =>
                              b.id && handleSetDefault(b.id)
                            }
                            aria-label={`Set ${b.bank_name} as default`}
                          />

                          {/* Edit Icon */}
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => { // prevent selecting bank
                              setSelectedId(Number(b.id));
                              setOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <Button
                className="w-full"
                onClick={() => {
                  setSelectedId(null);
                  setOpen(true);
                }}
              >
                + Add New Bank
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        <input type="hidden" value={selectedBank.id ?? ""} name="bank_id" />

        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Account Holder</FormLabel>
            <FormControl>
              <Input value={selectedBank.account_holder_name ?? ""} disabled />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Bank Name</FormLabel>
            <FormControl>
              <Input value={selectedBank.bank_name ?? ""} disabled />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input value={selectedBank.account_number ?? ""} disabled />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>IFSC Code</FormLabel>
            <FormControl>
              <Input value={selectedBank.ifsc_code ?? ""} disabled />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Branch</FormLabel>
            <FormControl>
              <Input value={selectedBank.branch_name ?? ""} disabled />
            </FormControl>
          </FormItem>
        </div>
      </div>

      {selectedId ? (
        <EditBank id={selectedId} open={open} setOpen={setOpen} />
      ) : (
        <AddBank open={open} setOpen={setOpen} />
      )}
    </>
  );
}
