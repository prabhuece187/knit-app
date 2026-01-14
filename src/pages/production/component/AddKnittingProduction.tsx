import CommonHeader from "@/components/common/CommonHeader";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  useGetNextProNoQuery,
  usePostKnittingProductionMutation,
} from "@/api/KnittingProductionApi";
import { KnittingProductionHeader } from "../common/KnittingProductionHeader";
import {
  fullKnittingProductionSchema,
  type FullKnittingProductionFormValues,
  type knittingProductionSchema,
} from "@/schema-types/production-schema";
import type { JobMaster, KnittingMachine } from "@/schema-types/master-schema";
import { useGetMachineSelectListQuery } from "@/api/KnittingMachineApi";
import { useGetJobListQuery } from "@/api/JobMasterApi";
import { KnittingProductionDetailsTable } from "../common/KnittingProductioDetails";
import { useEffect } from "react";

export default function AddKnittingProduction() {
  const [postProduction] = usePostKnittingProductionMutation();

  const { data: nextProNo } = useGetNextProNoQuery();

  console.log(nextProNo);

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
      details: [{ user_id: 1 }],
    },
  });

  useEffect(() => {
    if (nextProNo?.pro_no) {
      form.setValue("production_no", nextProNo.pro_no, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [nextProNo, form]);

  console.log(machines);

  const { control, setValue, watch } = form;

  function onSubmit(values: z.infer<typeof knittingProductionSchema>) {
    postProduction(values);
  }

  return (
    <>
      <CommonHeader name="Add Knitting Production" />

      <Form {...form}>
        <form
          id="production-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="production_no"
            render={({ field }) => <Input type="hidden" {...field} />}
          />

          <KnittingProductionHeader
            control={control}
            jobCards={jobCards}
            machines={machines}
            watch={watch}
            setValue={setValue}
          />

          <KnittingProductionDetailsTable
            name="details"
            control={control}
            setValue={setValue}
            watch={watch}
          />

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
