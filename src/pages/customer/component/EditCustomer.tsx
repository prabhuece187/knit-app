"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  useGetCustomerByIdQuery,
  usePutCustomerMutation,
} from "@/api/CustomerApi";

import { useGetStateListQuery } from "@/api/StateApi";
import { customerSchema, stateSchema } from "@/schema-types/master-schema";

import { SelectPopover } from "@/components/custom/CustomPopover";
import CommonHeader from "@/components/common/CommonHeader";

export default function EditCustomer({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  const [putCustomer] = usePutCustomerMutation();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
  });

  const { data: member, isSuccess } = useGetCustomerByIdQuery(id, {
    skip: id === undefined,
  });

  useEffect(() => {
    if (id && isSuccess && member) {
      form.reset(member);
    }
  }, [id, isSuccess, member, form]);

  function onSubmit(values: z.infer<typeof customerSchema>) {
    putCustomer(values);
    setOpen(false);
  }

  type State = z.infer<typeof stateSchema>;
  const { data: states = [] } = useGetStateListQuery("") as { data: State[] };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-0
          [&>button]:top-[6%]
          [&>button]:-translate-y-1/2
          [&>button]:right-4
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:hover:bg-muted
        "
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Edit Customer" />
          <p className="text-xs text-muted-foreground">
            Update Customer Details
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Name */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Customer Name <span className="text-red-500">*</span>
                      </FormLabel>
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
                <SelectPopover
                  label="State"
                  placeholder="Select state..."
                  options={states}
                  valueKey="id"
                  labelKey="state_name"
                  name="state_id"
                  control={form.control}
                />
              </div>

              {/* GST */}
              <div>
                <FormField
                  control={form.control}
                  name="customer_gst_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        GST Number <span className="text-red-500">*</span>
                      </FormLabel>
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
                  name="customer_mobile"
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

              {/* Email (FULL WIDTH) */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="customer_email"
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

              {/* Address */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="customer_address"
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
