import CommonHeader from "@/components/common/CommonHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  fullOutwardSchema,
  outwardSchema,
  type FullOutwardFormValues,
  type OutwardDetail,
} from "@/schema-types/outward-schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  useGetOutwardByIdQuery,
  usePutOutwardMutation,
} from "@/api/OutwardApi";
import { SelectPopover } from "@/components/common/SelectPopover";
import type { Customer, Mill } from "@/schema-types/master-schema";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";
import { ItemsDetailsTable } from "@/components/common/ItemDetailsTable";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function EditOutward() {
  const [putOutward] = usePutOutwardMutation();

  // Fetch customers and mills
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };
  const { data: mills = [] } = useGetMillListQuery("") as { data: Mill[] };

  const form = useForm<FullOutwardFormValues>({
    resolver: zodResolver(fullOutwardSchema),
    defaultValues: {
      user_id: 1,
      outward_date: new Date().toISOString().split("T")[0],
    },
  });

  const { control, setValue, watch } = form;

  // Get outwardId from URL
  const { outwardId } = useParams();

  const { data: outward, isSuccess } = useGetOutwardByIdQuery(outwardId, {
    skip: outwardId === undefined,
  });

  useEffect(() => {
    if (isSuccess && outward) {
      const mappedOutward = {
        ...outward,
        outward_details: outward.Items.map((item: OutwardDetail) => ({
          id: item.id,
          outward_id: item.outward_id,
          item_id: item.item_id,
          yarn_type_id: item.yarn_type_id,
          yarn_dia: item.yarn_dia,
          yarn_gsm: item.yarn_gsm,
          yarn_gauge: item.yarn_gauge,
          outward_qty: item.outward_qty,
          outward_weight: item.outward_weight,
          deliverd_weight: item.deliverd_weight,
          outward_detail_date: item.outward_detail_date,
          yarn_colour: item.yarn_colour,
        })),
      };

      form.reset(mappedOutward);
    }
  }, [isSuccess, outward, form]);

  function onSubmit(values: z.infer<typeof outwardSchema>) {
    putOutward(values);
  }

  return (
    <>
      <div className="px-2 lg:px-6">
        <CommonHeader name="Edit Outward" />
        <Card className="@container/card">
          <CardContent className="pt-4">
            <Form {...form}>
              <form
                id="outward-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* MAIN FORM GRID */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Hidden User ID */}
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => <Input type="hidden" {...field} />}
                  />

                  {/* Customer */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <SelectPopover
                      label="Customer"
                      placeholder="Select customer..."
                      options={customers}
                      valueKey="id"
                      labelKey="customer_name"
                      name="customer_id"
                      control={form.control}
                    />
                  </div>

                  {/* Mill */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <SelectPopover
                      label="Mill"
                      placeholder="Select mill..."
                      options={mills}
                      valueKey="id"
                      labelKey="mill_name"
                      name="mill_id"
                      control={form.control}
                    />
                  </div>

                  {/* Outward No */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="outward_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outward No*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Outward No." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Invoice No */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="outward_invoice_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice No*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Invoice No." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tin No */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="outward_tin_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TIN No*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter TIN No." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Outward Date */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="outward_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outward Date*</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Vehicle No */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="outward_vehicle_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle No</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Vehicle No" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Total Weight */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="total_weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Weight</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter Total Weight"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Total Quantity */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="total_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter Total Quantity"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Status" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Yarn Send */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <FormField
                      control={form.control}
                      name="yarn_send"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yarn Send</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter Yarn Send" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* OUTWARD DETAILS TABLE */}
                <ItemsDetailsTable
                  name="outward_details"
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  mode="outward"
                />

                {/* Form Buttons */}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
