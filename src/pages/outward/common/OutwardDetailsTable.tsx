"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

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

interface OutwardDetailsProps<TFormValues extends FieldValues> {
  name: ArrayPath<TFormValues>;
  control: Control<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
}

export function OutwardDetailsTable<TFormValues extends FieldValues>({
  name,
  control,
  setValue,
  watch,
}: OutwardDetailsProps<TFormValues>) {
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

  // outward row structure
  const defaultRow: RowType = {
    item_id: 0,
    yarn_type_id: 0,
    bag_no: "",
    dispatch_qty: 0,
    dispatch_weight: 0,
    uom: "",
    yarn_gauge: "",
    yarn_dia: 0,
    yarn_gsm: 0,
    remarks: "",
  };

  const recalc = (rows: RowType[]) => {
    const totalWeight = rows.reduce(
      (sum, r) => sum + (r["dispatch_weight"] || 0),
      0
    );

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
  };

  const typeChange = (selected: YarnType, index: number) => {
    setValue(
      buildPath(index, "yarn_type_id"),
      (selected.id ?? 0) as RowType["yarn_type_id"]
    );
  };

  if (fields.length === 0) append(defaultRow);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Yarn Type</TableHead>
            <TableHead>Bag No</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>UOM</TableHead>
            <TableHead>Gauge</TableHead>
            <TableHead>Dia</TableHead>
            <TableHead>GSM</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fields.map((f, index) => (
            <TableRow key={f.id}>
              {/* Item */}
              <TableCell>
                <SelectPopover
                  label="Item"
                  placeholder="Select Item..."
                  options={items}
                  valueKey="id"
                  labelKey="item_name"
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
                  label="Yarn Type"
                  placeholder="Select Type..."
                  options={yarntypes}
                  valueKey="id"
                  labelKey="yarn_type"
                  hideLabel
                  value={watch(buildPath(index, "yarn_type_id"))}
                  onValueChange={(val: number | undefined) => {
                    if (!val) return;
                    setValue(
                      buildPath(index, "yarn_type_id"),
                      val as RowType["yarn_type_id"]
                    );
                    const yt = yarntypes.find((x) => x.id === val);
                    if (yt) typeChange(yt, index);
                  }}
                />
              </TableCell>

              {/* Bag No */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "bag_no")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Bag No" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Qty */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "dispatch_qty")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Weight */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "dispatch_weight")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(+e.target.value);
                            recalc(watchRows);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* UOM */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "uom")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="UOM" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Gauge */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "yarn_gauge")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Gauge" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Dia */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "yarn_dia")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* GSM */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "yarn_gsm")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Remarks */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "remarks")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Remarks" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-center">
                <Button type="button" onClick={() => append(defaultRow)}>
                  <IconPlus />
                </Button>
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
  );
}
