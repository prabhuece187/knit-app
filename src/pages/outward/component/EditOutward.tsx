import CommonHeader from "@/components/common/CommonHeader";
import { Form } from "@/components/ui/form";

import {
  fullOutwardSchema,
  type FullOutwardFormValues,
  type OutwardDetail,
} from "@/schema-types/outward-schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

import { Button } from "@/components/ui/button";

import {
  useGetOutwardByIdQuery,
  usePutOutwardMutation,
} from "@/api/OutwardApi";

import type { Customer, Mill } from "@/schema-types/master-schema";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";

import OutwardHeader from "../common/OutwardHeader";
import { OutwardDetailsTable } from "../common/OutwardDetailsTable";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function EditOutward() {
  const navigate = useNavigate();
  const [putOutward] = usePutOutwardMutation();

  // Dropdowns
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
      outward_details: [],
    },
  });

  const { control, setValue, watch } = form;

  // Get route param
  const { outwardId } = useParams();

  const { data: outward, isSuccess } = useGetOutwardByIdQuery(outwardId, {
    skip: !outwardId,
  });

  /**
   * -------------------------------------------------------
   * MAP API RESPONSE → FORM VALUES
   * -------------------------------------------------------
   */
  useEffect(() => {
    if (isSuccess && outward) {
      const mappedDetails = outward.Items.map((item: OutwardDetail) => ({
        id: item.id,
        outward_id: item.outward_id,
        item_id: item.item_id,
        yarn_type_id: item.yarn_type_id,
        shade: item.shade ?? "",
        bag_no: item.bag_no ?? "",
        gross_weight: item.gross_weight,
        tare_weight: item.tare_weight,
        net_weight: item.net_weight,
        uom: item.uom ?? "KG",
        remarks: item.remarks ?? "",
      }));

      form.reset({
        ...outward,
        outward_details: mappedDetails,
      });
    }
  }, [isSuccess, outward, form]);

  /**
   * -------------------------------------------------------
   * SUBMIT HANDLER
   * -------------------------------------------------------
   */
  function onSubmit(values: z.infer<typeof fullOutwardSchema>) {
    console.log("EDIT OUTWARD SENT:", values);
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
          {/* HEADER (same as add outward) */}
          <OutwardHeader
            control={control}
            customers={customers}
            mills={mills}
            watch={watch}
            setValue={setValue}
          />

          {/* DETAILS TABLE */}
          <OutwardDetailsTable
            name="outward_details"
            control={control}
            setValue={setValue}
            watch={watch}
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
