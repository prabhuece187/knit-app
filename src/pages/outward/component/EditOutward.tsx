import CommonHeader from "@/components/common/CommonHeader";
import { Form } from "@/components/ui/form";
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

import type { Customer, Mill } from "@/schema-types/master-schema";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";

import { ItemsDetailsTable } from "@/components/common/ItemDetailsTable";
import OutwardHeader from "../common/OutwardHeader";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function EditOutward() {
  const navigate = useNavigate();
  const [putOutward] = usePutOutwardMutation();

  // Fetch dropdown data
  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const { data: mills = [] } = useGetMillListQuery("") as {
    data: Mill[];
  };

  // Form setup
  const form = useForm<FullOutwardFormValues>({
    resolver: zodResolver(fullOutwardSchema),
    defaultValues: {
      user_id: 1,
      outward_date: new Date().toISOString().split("T")[0],
    },
  });

  const { control, setValue, watch } = form;

  // Get outward ID from URL
  const { outwardId } = useParams();

  const { data: outward, isSuccess } = useGetOutwardByIdQuery(outwardId, {
    skip: !outwardId,
  });

  // Load edit data
  useEffect(() => {
    if (isSuccess && outward) {
      const mappedOutward: FullOutwardFormValues = {
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
    console.log("EDIT OUTWARD SENT DATA:", values);
    putOutward(values);
    navigate("/outward", { replace: true });
  }

  return (
    <>
      <CommonHeader name="Edit Outward" />

      <Form {...form}>
        <form
          id="outward-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* HEADER SAME LIKE ADD OUTWARD */}
          <OutwardHeader
            control={control}
            customers={customers}
            mills={mills}
            watch={watch}
            setValue={setValue}
          />

          {/* DETAILS TABLE */}
          <ItemsDetailsTable
            name="outward_details"
            control={control}
            setValue={setValue}
            watch={watch}
            mode="outward"
          />

          {/* BUTTONS */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
