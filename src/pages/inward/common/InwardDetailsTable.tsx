"use client";

import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  // FormItem, FormControl
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

import { SelectPopover } from "@/components/custom/CustomPopover";
import { useFieldArray } from "react-hook-form";

import { useGetItemListQuery } from "@/api/ItemApi";
import { useGetYarnTypeListQuery } from "@/api/YarnTypeApi";

import type { Item, YarnType } from "@/schema-types/master-schema";
import type {
  ArrayPath,
  Control,
  UseFormSetValue,
  UseFormWatch,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { useState } from "react";
import { JobCardSelectModal } from "../component/JobCardSelectModal";

interface InwardDetailsProps<TFormValues extends FieldValues> {
  name: ArrayPath<TFormValues>;
  control: Control<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  isEdit?: boolean;
}

export function InwardDetailsTable<TFormValues extends FieldValues>({
  name,
  control,
  setValue,
  watch,
  isEdit = true,
}: InwardDetailsProps<TFormValues>) {
  const { data: items = [] } = useGetItemListQuery("") as { data: Item[] };
  const { data: yarntypes = [] } = useGetYarnTypeListQuery("") as {
    data: YarnType[];
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  type RowType = TFormValues[typeof name][number];
  const watchRows = watch(name as Path<TFormValues>) as RowType[];

  const buildPath = <K extends keyof RowType>(index: number, key: K) =>
    `${name}.${index}.${String(key)}` as Path<TFormValues>;

  const defaultRow: RowType = {
    item_id: 0,
    yarn_type_id: 0,
    shade: "",
    bag_no: "",
    remarks: "",
  };

  const recalc = (rows: RowType[]) => {
    const totalWeight = rows.reduce((sum, r) => sum + (r.net_weight || 0), 0);

    setValue(
      "total_weight" as Path<TFormValues>,
      totalWeight as PathValue<TFormValues, Path<TFormValues>>
    );
  };

  const itemChange = (selected: Item, index: number) => {
    setValue(
      buildPath(index, "item_id"),
      (selected.id ?? 0) as RowType["item_id"]
    );
    // amountCalculation(watchItems);
  };

  const typeChange = (selected: YarnType, index: number) => {
    setValue(
      buildPath(index, "yarn_type_id"),
      (selected.id ?? 0) as RowType["yarn_type_id"]
    );
  };

  const [jobCardModalOpen, setJobCardModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  console.log(jobCardModalOpen);
  console.log(selectedRowIndex);
  console.log(isEdit);

  if (fields.length === 0) append(defaultRow);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead>Item Name Select</TableHead>
              <TableHead>Yarn</TableHead>
              {isEdit && <TableHead>Job Card</TableHead>}
              <TableHead>Weight</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fields.map((f, index) => (
              <TableRow key={f.id} className="align-top">
                {/* Item */}
                <TableCell>
                  <SelectPopover
                    placeholder="Item"
                    options={items}
                    valueKey="id"
                    labelKey="item_name"
                    label=""
                    value={watch(buildPath(index, "item_id"))}
                    hideLabel
                    onValueChange={(val: number | undefined) => {
                      if (!val) return;
                      setValue(
                        buildPath(index, "item_id"),
                        val as RowType["item_id"]
                      );
                      const selectedItem = items.find((i) => i.id === val);
                      if (selectedItem) itemChange(selectedItem, index);
                    }}
                  />
                </TableCell>

                {/* Yarn Type */}
                <TableCell>
                  <SelectPopover
                    placeholder="Yarn Type"
                    options={yarntypes}
                    valueKey="id"
                    labelKey="yarn_type"
                    label=""
                    value={watch(buildPath(index, "yarn_type_id"))}
                    hideLabel
                    onValueChange={(val: number | undefined) => {
                      if (!val) return;
                      setValue(
                        buildPath(index, "yarn_type_id"),
                        val as RowType["yarn_type_id"]
                      );
                      const selectedType = yarntypes.find(
                        (yt) => yt.id === val
                      );
                      if (selectedType) typeChange(selectedType, index);
                    }}
                  />
                </TableCell>

                {/* Job Card No */}
                {isEdit && (
                  <TableCell>
                    {watch(buildPath(index, "job_card_no")) || "-"}
                  </TableCell>
                )}

                {/* ID → Shade / Bag */}
                <TableCell>
                  <div className="flex flex-col gap-1 min-w-[160px]">
                    <FormField
                      control={control}
                      name={buildPath(index, "shade")}
                      render={({ field }) => (
                        <Input placeholder="Shade" {...field} />
                      )}
                    />
                    <FormField
                      control={control}
                      name={buildPath(index, "bag_no")}
                      render={({ field }) => (
                        <Input placeholder="Bag No" {...field} />
                      )}
                    />
                  </div>
                </TableCell>

                {/* Weight → Vertical */}
                <TableCell>
                  <div className="flex flex-col gap-1 min-w-[150px]">
                    <FormField
                      control={control}
                      name={buildPath(index, "gross_weight")}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Gross"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                            recalc(watchRows);
                          }}
                        />
                      )}
                    />
                    <FormField
                      control={control}
                      name={buildPath(index, "tare_weight")}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Tare"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                            recalc(watchRows);
                          }}
                        />
                      )}
                    />
                    <FormField
                      control={control}
                      name={buildPath(index, "net_weight")}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Net"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                            recalc(watchRows);
                          }}
                        />
                      )}
                    />
                  </div>
                </TableCell>

                {/* Specs → Vertical */}
                <TableCell>
                  <div className="flex flex-col gap-1 min-w-[150px]">
                    <FormField
                      control={control}
                      name={buildPath(index, "yarn_gauge")}
                      render={({ field }) => (
                        <Input placeholder="Gauge" {...field} />
                      )}
                    />
                    <FormField
                      control={control}
                      name={buildPath(index, "yarn_dia")}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Dia"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      )}
                    />
                    <FormField
                      control={control}
                      name={buildPath(index, "yarn_gsm")}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="GSM"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      )}
                    />
                  </div>
                </TableCell>

                {/* UOM */}
                <TableCell>
                  <FormField
                    control={control}
                    name={buildPath(index, "uom")}
                    render={({ field }) => (
                      <Input placeholder="UOM" {...field} />
                    )}
                  />
                </TableCell>

                {/* Remarks */}
                <TableCell>
                  <FormField
                    control={control}
                    name={buildPath(index, "remarks")}
                    render={({ field }) => (
                      <Input placeholder="Remarks" {...field} />
                    )}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center">
                  <Button type="button" onClick={() => append(defaultRow)}>
                    <IconPlus />
                  </Button>
                  {isEdit && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedRowIndex(index);
                        setJobCardModalOpen(true);
                      }}
                    >
                      <IconEdit size={16} />
                    </Button>
                  )}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      <IconTrash />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedRowIndex !== null && (
        <JobCardSelectModal
          open={jobCardModalOpen}
          onClose={() => setJobCardModalOpen(false)}
          inwardDetailId={watch(buildPath(selectedRowIndex, "id")) as number}
          defaultValue={
            watch(buildPath(selectedRowIndex, "job_card_id")) as
              | number
              | undefined
          }
          onSuccess={(jobCardId) => {
            const path = buildPath(selectedRowIndex, "job_card_id");

            setValue(path, jobCardId as PathValue<TFormValues, typeof path>, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      )}
    </>
  );
}
