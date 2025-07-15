import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { SelectPopover } from "./SelectPopover";
import { useGetYarnTypeListQuery } from "@/api/YarnTypeApi";
import { useGetItemListQuery } from "@/api/ItemApi";
import type { Item, YarnType } from "@/schema-types/master-schema";
import type {
  FieldValues,
  PathValue,
  Control,
  UseFormSetValue,
  UseFormWatch,
  Path,
  ArrayPath,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Card, CardContent } from "../ui/card";

interface ItemsDetailsTableProps<TFormValues extends FieldValues> {
  name: ArrayPath<TFormValues>;
  control: Control<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  mode?: "inward" | "outward";
}

export function ItemsDetailsTable<TFormValues extends FieldValues>({
  name,
  control,
  setValue,
  watch,
  mode = "inward",
}: ItemsDetailsTableProps<TFormValues>) {
  const { data: yarntypes = [] } = useGetYarnTypeListQuery("") as {
    data: YarnType[];
  };
  const { data: items = [] } = useGetItemListQuery("") as { data: Item[] };

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Get the type of each item in the array field
  type RowType = TFormValues[typeof name][number];

  const watchItems = watch(name as Path<TFormValues>) as RowType[];

  const defaultRow: RowType =
    mode === "outward"
      ? {
          item_id: 0,
          user_id: 1,
          outward_qty: 0,
          outward_weight: 0,
          yarn_dia: 0,
          yarn_gsm: 0,
          yarn_gauge: "",
          outward_detail_date: new Date().toISOString().split("T")[0],
          yarn_colour: "",
          deliverd_weight: 0,
        }
      : {
          item_id: 0,
          user_id: 1,
          inward_qty: 0,
          inward_weight: 0,
          yarn_dia: 0,
          yarn_gsm: 0,
          yarn_gauge: "",
          inward_detail_date: new Date().toISOString().split("T")[0],
          yarn_colour: "",
        };

  const qtyField = mode === "outward" ? "outward_qty" : "inward_qty";
  const weightField = mode === "outward" ? "outward_weight" : "inward_weight";
  const dateField =
    mode === "outward" ? "outward_detail_date" : "inward_detail_date";

  const amountCalculation = (details: RowType[]) => {
    const totalQty = details.reduce(
      (sum, item) => sum + (item[qtyField] || 0),
      0
    );
    const totalWeight = details.reduce(
      (sum, item) => sum + (item[weightField] || 0),
      0
    );

    setValue(
      "total_quantity" as Path<TFormValues>,
      totalQty as PathValue<TFormValues, Path<TFormValues>>
    );
    setValue(
      "total_weight" as Path<TFormValues>,
      totalWeight as PathValue<TFormValues, Path<TFormValues>>
    );
  };

  const buildPath = <K extends keyof RowType>(
    index: number,
    prop: K
  ): Path<TFormValues> =>
    `${name}.${index}.${String(prop)}` as Path<TFormValues>;

  const itemChange = (selected: Item, index: number) => {
    setValue(
      buildPath(index, "item_id"),
      (selected.id ?? 0) as RowType["item_id"]
    );
    amountCalculation(watchItems);
  };

  const typeChange = (selected: YarnType, index: number) => {
    setValue(
      buildPath(index, "yarn_type_id"),
      (selected.id ?? 0) as RowType["yarn_type_id"]
    );
  };

  const itemPropChange = <K extends keyof RowType>(
    index: number,
    propName: K,
    value: RowType[K]
  ) => {
    setValue(buildPath(index, propName), value);
    amountCalculation(watchItems);
  };

  if (fields.length === 0) {
    append(defaultRow);
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Yarn Type</TableHead>
            <TableHead>Yarn Gauge</TableHead>
            <TableHead>
              {mode === "outward" ? "Outward Date" : "Inward Date"}
            </TableHead>
            <TableHead>
              {mode === "outward" ? "Outward Qty" : "Inward Qty"}
            </TableHead>
            <TableHead>
              {mode === "outward" ? "Outward Weight" : "Inward Weight"}
            </TableHead>
            <TableHead>Dia</TableHead>
            <TableHead>GSM</TableHead>
            <TableHead>Colour</TableHead>
            {mode === "outward" && <TableHead>Delivered Weight</TableHead>}
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              {/* Item */}
              <TableCell>
                <SelectPopover
                  label="Item"
                  placeholder="Select Item..."
                  options={items}
                  valueKey="id"
                  labelKey="item_name"
                  name={buildPath(index, "item_id")}
                  control={control}
                  onValueChange={(val) => itemChange(val, index)}
                  hideLabel
                />
              </TableCell>
              {/* Yarn Type */}
              <TableCell>
                <SelectPopover
                  label="Yarn Type"
                  placeholder="Select Yarn Type..."
                  options={yarntypes}
                  valueKey="id"
                  labelKey="yarn_type"
                  name={buildPath(index, "yarn_type_id")}
                  control={control}
                  onValueChange={(val) => typeChange(val, index)}
                  hideLabel
                />
              </TableCell>
              {/* Yarn Gauge */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "yarn_gauge")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter Gauge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              {/* Date */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, dateField as keyof RowType)}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              {/* Quantity */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, qtyField as keyof RowType)}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          {...field}
                          onChange={(e) =>
                            itemPropChange(index, qtyField, +e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              {/* Weight */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, weightField as keyof RowType)}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Weight"
                          {...field}
                          onChange={(e) =>
                            itemPropChange(index, weightField, +e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
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
                          placeholder="Enter Dia"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
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
                          placeholder="Enter GSM"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              {/* Colour */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "yarn_colour")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter Colour" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Extra fields for Inward */}
              {mode === "outward" && (
                <>
                  {/* deliverd_weight */}
                  <TableCell>
                    <FormField
                      control={control}
                      name={buildPath(index, "deliverd_weight")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Deliverd weight"
                              {...field}
                              onChange={(e) => field.onChange(+e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </>
              )}

              {/* Actions */}
              <TableCell className="text-center">
                <Button
                  className="m-1"
                  type="button"
                  onClick={() => append(defaultRow)}
                >
                  <IconPlus className="w-[36px] h-[32px]" />
                </Button>
                <Button
                  className="m-1"
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <IconTrash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-6">
        <Card className="w-fit">
          <CardContent className="flex gap-8 px-6 py-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-sm">Total Quantity</span>
              <span className="text-xl font-bold">
                {watch("total_quantity" as Path<TFormValues>)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm">Total Weight</span>
              <span className="text-xl font-bold">
                {watch("total_weight" as Path<TFormValues>)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
