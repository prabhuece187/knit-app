import CommonHeader from "@/components/common/CommonHeader";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  fullKnittingProductionSchema,
  type FullKnittingProductionFormValues,
  type KnittingProductionDetail,
} from "@/schema-types/production-schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

import { Button } from "@/components/ui/button";

import {
  useGetKnittingProductionByIdQuery,
  usePutKnittingProductionMutation,
} from "@/api/KnittingProductionApi";

import type { JobMaster, KnittingMachine } from "@/schema-types/master-schema";
import { useGetJobListQuery } from "@/api/JobMasterApi";
import { useGetMachineSelectListQuery } from "@/api/KnittingMachineApi";

import { KnittingProductionHeader } from "../common/KnittingProductionHeader";
import { KnittingProductionDetailsTable } from "../common/KnittingProductioDetails";

import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function EditKnittingProduction() {
  const [putProduction] = usePutKnittingProductionMutation();

  const { data: jobCards = [] } = useGetJobListQuery("") as {
    data: JobMaster[];
  };

  const { data: machines = [] } = useGetMachineSelectListQuery() as {
    data: KnittingMachine[];
  };

  const form = useForm<FullKnittingProductionFormValues>({
    resolver: zodResolver(fullKnittingProductionSchema),
    defaultValues: {
      user_id: 1,
      production_date: new Date().toISOString().split("T")[0],
      details: [],
    },
  });

  const { control, setValue, watch } = form;

  const { id } = useParams();

  const productionId = Number(id);

  const { data: production, isSuccess } = useGetKnittingProductionByIdQuery(
    productionId,
    {
      skip: !id,
    }
  );

  /**
   * -------------------------------------------------
   * MAP DATABASE RESULT -> FORM FORMAT
   * -------------------------------------------------
   */
  useEffect(() => {
    if (isSuccess && production) {
      const mappedDetails = production.details.map(
        (item: KnittingProductionDetail) => ({
          id: item.id,
          knitting_production_id: item.knitting_production_id,
          produced_weight: item.produced_weight,
          rolls_count: item.rolls_count,
          dia: item.dia,
          gsm: item.gsm,
          user_id: item.user_id,
        })
      );

      form.reset({
        id: production.id,
        user_id: production.user_id,
        production_no: production.production_no,
        production_date: production.production_date,
        job_card_id: production.job_card_id,
        machine_id: production.machine_id,
        shift: production.shift,
        operator_name: production.operator_name,
        remarks: production.remarks,
        details: mappedDetails,
      });
    }
  }, [isSuccess, production, form]);

  /**
   * -------------------------------------------------
   * SUBMIT
   * -------------------------------------------------
   */
  function onSubmit(values: z.infer<typeof fullKnittingProductionSchema>) {
    putProduction(values);
  }

  return (
    <>
      <CommonHeader name="Edit Knitting Production" />

      <Form {...form}>
        <form
          id="production-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Hidden Fields */}
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => <Input type="hidden" {...field} />}
          />

          <FormField
            control={form.control}
            name="production_no"
            render={({ field }) => <Input type="hidden" {...field} />}
          />

          {/* Header */}
          <KnittingProductionHeader
            control={control}
            jobCards={jobCards}
            machines={machines}
            watch={watch}
            setValue={setValue}
          />

          {/* Details Table */}
          <KnittingProductionDetailsTable
            name="details"
            control={control}
            setValue={setValue}
            watch={watch}
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
