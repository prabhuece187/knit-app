import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { usePostCustomerMutation } from "@/api/CustomerApi";
import { Textarea } from "@/components/ui/textarea";
import { customerSchema, stateSchema } from "@/schema-types/master-schema";
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
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetStateListQuery } from "@/api/StateApi";

import { SelectPopover } from "@/components/common/SelectPopover";
import CommonHeader from "@/components/common/CommonHeader";

export default function AddCustomer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postCustomer] = usePostCustomerMutation();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      user_id: 1,
    },
  });

  function onSubmit(values: z.infer<typeof customerSchema>) {
    postCustomer(values);
    setOpen(false);
  }

  type State = z.infer<typeof stateSchema>;

  const { data: states = [] } = useGetStateListQuery("") as { data: State[] };

  return (
    <>
      <div className="px-4 lg:px-6">
        <Dialog open={open} onOpenChange={setOpen}>
          {/* <DialogTrigger></DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <CommonHeader name={"Add Customer"} />
              </DialogTitle>
              <DialogDescription>
                {/* Make changes to customer details. Click save when you're done. */}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-12 px-2 py-2">
              <div className="col-span-12">
                <Form {...form}>
                  <form
                    id="customer-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-6 gap-2">
                      <div className="col-span-3" hidden>
                        <FormField
                          control={form.control}
                          name="user_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>User Id</FormLabel>
                              <FormControl>
                                <Input
                                  type="hidden"
                                  placeholder="Enter the User Id"
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
                          name="customer_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the Customer Name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <SelectPopover
                          label="State*"
                          placeholder="Select state..."
                          options={states}
                          valueKey="id"
                          labelKey="state_name"
                          name="state_id"
                          control={form.control}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="customer_gst_no"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Number*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the GST Number"
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
                          name="customer_mobile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the Mobile Number"
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
                          name="customer_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter the Email"
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
                          name="customer_address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter the Address"
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
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 flex justify-end">
                        <Button type="submit" className="m-1">
                          Cancel
                        </Button>
                        <Button type="submit" className="m-1">
                          Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
