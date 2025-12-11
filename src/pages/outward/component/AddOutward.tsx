// import CommonHeader from "@/components/common/CommonHeader";
import { Form } from "@/components/ui/form";
import {
  fullOutwardSchema,
  outwardSchema,
  type FullOutwardFormValues,
} from "@/schema-types/outward-schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { usePostOutwardMutation } from "@/api/OutwardApi";

import type { Customer, Mill } from "@/schema-types/master-schema";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { ItemsDetailsTable } from "@/components/common/ItemDetailsTable";
import { useGetMillListQuery } from "@/api/MillApi";
import OutwardHeader from "../common/OutwardHeader";
import CommonHeader from "@/components/common/CommonHeader";
import { useNavigate } from "react-router-dom";

export default function AddOutward() {
  const [postOutward] = usePostOutwardMutation();

  // Fetch customers and mills
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const navigate = useNavigate();

  const { data: mills = [] } = useGetMillListQuery("") as { data: Mill[] };

  const form = useForm<FullOutwardFormValues>({
    resolver: zodResolver(fullOutwardSchema),
    defaultValues: {
      user_id: 1,
      outward_invoice_no: "1",
      outward_date: new Date().toISOString().split("T")[0],
    },
  });

  const { control, setValue, watch } = form;

  console.log(form.formState.errors);

  function onSubmit(values: z.infer<typeof outwardSchema>) {
    console.log("OUTWARD SENT DATA:", values);
    postOutward(values);
    navigate("/outward", { replace: true });
    
  }

  return (
    <>
      <CommonHeader name="Add Outward" />
      <Form {...form}>
        <form
          id="outward-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <OutwardHeader
            control={control}
            customers={customers}
            mills={mills}
            watch={watch}
            setValue={setValue}
          />

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
    </>
  );
}
