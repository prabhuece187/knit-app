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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      user_id: 1,
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
    console.log("its run");
    postBank(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Add Bank" />
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
            className="space-y-6"
          >
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3" hidden>
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Bank Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="branch_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Branch Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Account Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="ifsc_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IFSC Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="bank_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="bank_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="bank_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="bank_mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Mobile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3 flex items-center space-x-2 mt-2">
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(!!checked)
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-medium">
                        Set as Default Bank
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
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
                      <FormMessage />
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
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
