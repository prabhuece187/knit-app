"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bankSchema } from "@/schema-types/master-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommonHeader from "@/components/common/CommonHeader";
import { usePostBankMutation } from "@/api/BankApi";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddBank({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postBank] = usePostBankMutation();

  const form = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      id: undefined,
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
      is_default: false,
    },
  });

  function onSubmit(values: z.infer<typeof bankSchema>) {
    postBank(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-0
          [&>button]:top-[5%]
          [&>button]:-translate-y-1/2
          [&>button]:right-4
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:hover:bg-muted"
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Add Bank" />
          <p className="text-xs text-muted-foreground">Enter Bank Details</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors),
            )}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Bank Name */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Bank Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10"
                          placeholder="Enter Bank Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Branch */}
              <div>
                <FormField
                  control={form.control}
                  name="branch_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* IFSC */}
              <div>
                <FormField
                  control={form.control}
                  name="ifsc_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input className="h-10 uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Account Holder */}
              <div>
                <FormField
                  control={form.control}
                  name="account_holder_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Account Number */}
              <div>
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* City */}
              <div>
                <FormField
                  control={form.control}
                  name="bank_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* State */}
              <div>
                <FormField
                  control={form.control}
                  name="bank_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <div>
                <FormField
                  control={form.control}
                  name="bank_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Mobile */}
              <div>
                <FormField
                  control={form.control}
                  name="bank_mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="bank_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Default Checkbox */}
              <div className="col-span-2 flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-lg">
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                      <span className="text-sm font-medium">
                        Set as Default Bank
                      </span>
                    </>
                  )}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="px-6">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
