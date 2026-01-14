"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

import { useFieldArray } from "react-hook-form";
import type {
  ArrayPath,
  Control,
  UseFormSetValue,
  UseFormWatch,
  FieldValues,
  Path,
} from "react-hook-form";

interface ProductionDetailsProps<TFormValues extends FieldValues> {
  name: ArrayPath<TFormValues>;
  control: Control<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
}

export function KnittingProductionDetailsTable<
  TFormValues extends FieldValues
>({
  name,
  control,
  // setValue,
  watch,
}: ProductionDetailsProps<TFormValues>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  type RowType = TFormValues[typeof name][number];
  const watchRows = watch(name as Path<TFormValues>) as RowType[];
  console.log(watchRows);

  const buildPath = <K extends keyof RowType>(index: number, key: K) =>
    `${name}.${index}.${String(key)}` as Path<TFormValues>;

  const defaultRow: RowType = {
    produced_weight: 0,
    rolls_count: 0,
    dia: 0,
    gsm: 0,
  };

  if (fields.length === 0) append(defaultRow);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produced Wt</TableHead>
          <TableHead>Rolls</TableHead>
          <TableHead>Dia</TableHead>
          <TableHead>GSM</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {fields.map((f, index) => (
          <TableRow key={f.id}>
            {/* Produced Weight */}
            <TableCell>
              <FormField
                control={control}
                name={buildPath(index, "produced_weight")}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(+e.target.value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TableCell>

            {/* Rolls */}
            <TableCell>
              <FormField
                control={control}
                name={buildPath(index, "rolls_count")}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(+e.target.value)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </TableCell>

            {/* Dia */}
            <TableCell>
              <FormField
                control={control}
                name={buildPath(index, "dia")}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(+e.target.value)
                        }
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
                name={buildPath(index, "gsm")}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(+e.target.value)
                        }
                      />
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
  );
}
