import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  useGetCustomerByIdQuery,
  usePutCustomerMutation,
} from "@/api/CustomerApi";
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

import { useEffect } from "react";
import { SelectPopover } from "@/components/custom/CustomPopover";
import CommonHeader from "@/components/common/CommonHeader";

export default function EditCustomer({
  open,
  setOpen,
  CustomerId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  CustomerId: number;
}) {
  // const formRef = useRef<HTMLFormElement>(null);

  const [putCustomer] = usePutCustomerMutation();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
  });

  const { data: member, isSuccess } = useGetCustomerByIdQuery(CustomerId, {
    skip: CustomerId === undefined,
  });

  useEffect(() => {
    if (isSuccess && member) {
      form.reset(member);
    }
  }, [isSuccess, member, form]);

  function onSubmit(values: z.infer<typeof customerSchema>) {
    putCustomer(values);
    setOpen(false);
  }

  type State = z.infer<typeof stateSchema>;

  const { data: states = [] } = useGetStateListQuery("") as { data: State[] };

  return (
    <>
        <Dialog open={open} onOpenChange={setOpen}>
          {/* <DialogTrigger></DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <CommonHeader name={"Edit Customer"} />
              </DialogTitle>
              <DialogDescription></DialogDescription>
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
    </>
  );
}
