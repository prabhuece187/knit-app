import CommonHeader from "@/components/common/CommonHeader";
import {
  Form,
  // FormControl,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form";
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
// import { ItemsDetailsTable } from "@/components/common/ItemDetailsTable";
import { useGetMillListQuery } from "@/api/MillApi";
import { InwardHeader } from "../common/InwardHeader";
import { InwardDetailsTable } from "../common/InwardDetailsTable";

export default function AddInward() {
  const [postInward] = usePostInwardMutation();

  // Fetch customers, mills, and states

  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const { data: mills = [] } = useGetMillListQuery("") as { data: Mill[] };

  const form = useForm<FullInwardFormValues>({
    resolver: zodResolver(fullInwardSchema),
    defaultValues: {
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



          <InwardHeader
            control={control}
            customers={customers}
            mills={mills}
            watch={watch}
            setValue={setValue}
          />
          {/* </div> */}

          {/* INWARD DETAILS TABLE */}
          <InwardDetailsTable
            name="inward_details"
            control={control}
            setValue={setValue}
            watch={watch}
            isEdit={false}
            // mode="inward"
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
