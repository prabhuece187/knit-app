import CommonHeader from "@/components/common/CommonHeader";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  fullInwardSchema,
  type FullInwardFormValues,
  type InwardDetail,
} from "@/schema-types/inward-schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

import { Button } from "@/components/ui/button";

import { useGetInwardByIdQuery, usePutInwardMutation } from "@/api/InwardApi";

import type { Customer, Mill } from "@/schema-types/master-schema";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";

import { InwardHeader } from "../common/InwardHeader";

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { InwardDetailsTable } from "../common/InwardDetailsTable";

type InwardDetailWithJob = InwardDetail & {
  job_master?: {
    job_card_no: string;
  };
};

export default function EditInward() {
  const [putInward] = usePutInwardMutation();

  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const { data: mills = [] } = useGetMillListQuery("") as {
    data: Mill[];
  };

  const form = useForm<FullInwardFormValues>({
    resolver: zodResolver(fullInwardSchema),
    defaultValues: {
      user_id: 1,
      inward_date: new Date().toISOString().split("T")[0],
      inward_details: [],
    },
  });

  const { control, setValue, watch } = form;

  const { inwardId } = useParams();

  const { data: inward, isSuccess } = useGetInwardByIdQuery(inwardId, {
    skip: inwardId === undefined,
  });

  /**
   * -------------------------------------------------
   * MAP DATABASE RESULT -> FORM FORMAT
   * -------------------------------------------------
   */
  useEffect(() => {
    if (isSuccess && inward) {
      const mappedDetails = inward.Items.map((item: InwardDetailWithJob) => ({
        id: item.id,
        inward_id: item.inward_id,
        item_id: item.item_id,
        yarn_type_id: item.yarn_type_id,
        shade: item.shade ?? "",
        bag_no: item.bag_no ?? "",
        gross_weight: item.gross_weight,
        tare_weight: item.tare_weight,
        net_weight: item.net_weight,
        uom: item.uom ?? "KG",
        yarn_gauge: item.yarn_gauge,
        yarn_dia: item.yarn_dia,
        yarn_gsm: item.yarn_gsm,
        remarks: item.remarks ?? "",
        job_card_id: item.job_card_id ?? null,
        job_card_no: item.job_master?.job_card_no ?? "",
      }));

      form.reset({
        ...inward,
        inward_details: mappedDetails,
      });
    }
  }, [isSuccess, inward, form]);

  /**
   * -------------------------------------------------
   * SUBMIT
   * -------------------------------------------------
   */
  function onSubmit(values: z.infer<typeof fullInwardSchema>) {
    putInward(values);
  }

  return (
    <>
      <CommonHeader name="Edit Inward" />

      <Form {...form}>
        <form
          id="inward-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Hidden user_id */}
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => <Input type="hidden" {...field} />}
          />

          {/*  Header (same as add page) */}
          <InwardHeader
            control={control}
            customers={customers}
            mills={mills}
            watch={watch}
            setValue={setValue}
          />

          {/* Item Details Table */}
          <InwardDetailsTable
            name="inward_details"
            control={control}
            setValue={setValue}
            watch={watch}
            isEdit={true}
          />

          {/* Buttons */}
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
