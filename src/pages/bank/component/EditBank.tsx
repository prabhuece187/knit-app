"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CommonHeader from "@/components/common/CommonHeader";

import { bankSchema } from "@/schema-types/master-schema";
import { useGetBankByIdQuery, usePutBankMutation } from "@/api/BankApi";
import { Checkbox } from "@/components/ui/checkbox";

// Type
type Bank = z.infer<typeof bankSchema>;

export default function EditBank({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  const [putBank] = usePutBankMutation();

  const form = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      id: undefined,
      user_id: 0,
      bank_name: "",
      branch_name: "",
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      bank_city: "",
      bank_state: "",
      bank_email: "",
      bank_mobile: "",
      bank_address: "",
      is_default: false, // ✅ boolean default
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = form;

  const { data: bankData, isSuccess } = useGetBankByIdQuery(id, {
    skip: id === undefined,
  });

  // Reset form when bank data is loaded
useEffect(() => {
  if (isSuccess && bankData) {
    reset({
      ...bankData,
      is_default: Boolean(bankData.is_default), // convert number → boolean
    });
  }
}, [isSuccess, bankData, reset]);

  function onSubmit(values: Bank) {
    // Ensure is_default is a number if backend expects 0/1
    const payload = {
      ...values,
      is_default: Boolean(values.is_default),
    };

    putBank(payload);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Edit Bank" />
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-4">
              {/* Hidden User ID */}
              <div hidden>
                <FormField
                  control={control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bank Name */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Bank Name" {...field} />
                      </FormControl>
                      <FormMessage>{errors.bank_name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Branch Name */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="branch_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Branch Name" {...field} />
                      </FormControl>
                      <FormMessage>{errors.branch_name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Account Holder Name */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="account_holder_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Account Holder Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {errors.account_holder_name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Account Number */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Account Number" {...field} />
                      </FormControl>
                      <FormMessage>
                        {errors.account_number?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* IFSC Code */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="ifsc_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IFSC Code" {...field} />
                      </FormControl>
                      <FormMessage>{errors.ifsc_code?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* City */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="bank_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter City" {...field} />
                      </FormControl>
                      <FormMessage>{errors.bank_city?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* State */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="bank_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter State" {...field} />
                      </FormControl>
                      <FormMessage>{errors.bank_state?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="bank_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Email" {...field} />
                      </FormControl>
                      <FormMessage>{errors.bank_email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Mobile */}
              <div className="col-span-3">
                <FormField
                  control={control}
                  name="bank_mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Mobile" {...field} />
                      </FormControl>
                      <FormMessage>{errors.bank_mobile?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Default Bank */}
              <div className="col-span-3 flex items-center space-x-2 mt-2">
                <FormField
                  control={control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false} // ensure boolean
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-medium">
                        Set as Default Bank
                      </FormLabel>
                      <FormMessage>{errors.is_default?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="col-span-6">
                <FormField
                  control={control}
                  name="bank_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{errors.bank_address?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
