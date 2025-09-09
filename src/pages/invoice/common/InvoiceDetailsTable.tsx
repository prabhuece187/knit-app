import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetItemListQuery } from "@/api/ItemApi";
import type { Item } from "@/schema-types/master-schema";
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
import { SelectPopover } from "@/components/custom/CustomPopover";
import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "../ui/card";

interface InvoiceDetailsTableProps<TFormValues extends FieldValues> {
  name: ArrayPath<TFormValues>;
  control: Control<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
}

export function InvoiceDetailsTable<TFormValues extends FieldValues>({
  name,
  control,
  setValue,
  watch,
}: InvoiceDetailsTableProps<TFormValues>) {
  const { data: items = [] } = useGetItemListQuery("") as { data: Item[] };

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Row type
  type RowType = TFormValues[typeof name][number];

  const watchItems = watch(name as Path<TFormValues>) as RowType[];

  const defaultRow: RowType = {
    id: 0,
    user_id: 1,
    invoice_id: 0,
    item_id: 0,
    item_description: "",
    hsn_code: "",
    quantity: 0,
    price: 0,
    item_discount_per: 0,
    item_discount_amount: 0,
    amount: 0,
  } as RowType;

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
    setValue(
      buildPath(index, "item_description"),
      (selected.item_name ?? "") as RowType["item_description"]
    );
  };

  const itemPropChange = <K extends keyof RowType>(
    index: number,
    propName: K,
    value: RowType[K]
  ) => {
    setValue(buildPath(index, propName), value);

    // Recalculate amount
    const row = watchItems[index];
    const qty = Number(row?.quantity || 0);
    const price = Number(row?.price || 0);
    const discountPer = Number(row?.item_discount_per || 0);

    const discountAmount = (qty * price * discountPer) / 100;
    const totalAmount = qty * price - discountAmount;

    setValue(
      buildPath(index, "item_discount_amount"),
      discountAmount as PathValue<TFormValues, Path<TFormValues>>
    );
    setValue(
      buildPath(index, "amount"),
      totalAmount as PathValue<TFormValues, Path<TFormValues>>
    );

    // Update invoice total at parent level
    const total = watchItems.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      totalAmount
    );
    setValue(
      "invoice_total" as Path<TFormValues>,
      total as PathValue<TFormValues, Path<TFormValues>>
    );
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
            <TableHead>Description</TableHead>
            <TableHead>HSN Code</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Disc %</TableHead>
            <TableHead>Disc Amt</TableHead>
            <TableHead>Amount</TableHead>
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

              {/* Item Description */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "item_description")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* HSN Code */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "hsn_code")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="HSN Code" {...field} />
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
                  name={buildPath(index, "quantity")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Qty"
                          {...field}
                          onChange={(e) =>
                            itemPropChange(index, "quantity", +e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Price */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "price")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Price"
                          {...field}
                          onChange={(e) =>
                            itemPropChange(index, "price", +e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Discount % */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "item_discount_per")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Disc %"
                          {...field}
                          onChange={(e) =>
                            itemPropChange(
                              index,
                              "item_discount_per",
                              +e.target.value
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Discount Amount */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "item_discount_amount")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          readOnly
                          placeholder="Disc Amt"
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              {/* Amount */}
              <TableCell>
                <FormField
                  control={control}
                  name={buildPath(index, "amount")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          readOnly
                          placeholder="Amount"
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

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

      {/* Totals */}
      {/* <div className="flex justify-end mt-6">
        <Card className="w-fit">
          <CardContent className="flex gap-8 px-6 py-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-sm">Invoice Total</span>
              <span className="text-xl font-bold">
                {watch("invoice_total" as Path<TFormValues>)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
