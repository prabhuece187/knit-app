import CommonHeader from "@/components/common/CommonHeader";
import {
  Form,
  // FormControl,
  FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  fullInwardSchema,
  inwardSchema,
  type FullInwardFormValues,
} from "@/schema-types/inward-schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { usePostInwardMutation } from "@/api/InwardApi";
import type { Customer, Mill } from "@/schema-types/master-schema";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { ItemsDetailsTable } from "@/components/common/ItemDetailsTable";
import { useGetMillListQuery } from "@/api/MillApi";
import { InwardHeader } from "../common/InwardHeader";

export default function AddInward() {
  const [postInward] = usePostInwardMutation();

  // Fetch customers, mills, and states

  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };
  console.log(customers);

  const { data: mills = [] } = useGetMillListQuery("") as { data: Mill[] };

  const form = useForm<FullInwardFormValues>({
    resolver: zodResolver(fullInwardSchema),
    defaultValues: {
      user_id: 1,
      inward_date: new Date().toISOString().split("T")[0],
    },
  });

  const { control, setValue, watch } = form;

  function onSubmit(values: z.infer<typeof inwardSchema>) {
    postInward(values);
  }

  return (
    <>
      <CommonHeader name="Add Inward" />
      <Form {...form}>
        <form
          id="inward-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* MAIN FORM GRID */}
          {/* <div className="grid grid-cols-12 gap-4"> */}
          {/* Hidden User ID */}
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => <Input type="hidden" {...field} />}
          />

          <InwardHeader
            control={control}
            customers={customers}
            mills={mills}
            watch={watch}
            setValue={setValue}
          />
          {/* </div> */}

          {/* INWARD DETAILS TABLE */}
          <ItemsDetailsTable
            name="inward_details"
            control={control}
            setValue={setValue}
            watch={watch}
            mode="inward"
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
    </>
  );
}
