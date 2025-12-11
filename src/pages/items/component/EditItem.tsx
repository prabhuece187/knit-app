"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import CommonHeader from "@/components/common/CommonHeader";
import { itemSchema } from "@/schema-types/master-schema";

import { useGetItemByIdQuery, usePutItemMutation } from "@/api/ItemApi";

import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";

export default function EditItem({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  const [updateItem] = usePutItemMutation();
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  // ----------- FORM INIT ------------
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
  });

  // ----------- GET ITEM DATA ------------
  const { data: item, isSuccess } = useGetItemByIdQuery(id, {
    skip: !id,
  });

  // ----------- RESET WHEN DATA ARRIVES ------------
  useEffect(() => {
    if (item && isSuccess) {
      form.reset(item);
    }
  }, [item, isSuccess, form]);

  // ----------- AUTO BARCODE + QR GENERATE ------------
  useEffect(() => {
    const name = form.watch("item_name");
    const code = form.watch("hsn_code");
    const finalValue = code || name;

    if (!finalValue) return;

    form.setValue("barcode", finalValue);
    form.setValue("qrcode", finalValue);

    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, finalValue, {
        format: "CODE128",
        displayValue: true,
        fontSize: 14,
      });
    }
  }, [form.watch("item_name"), form.watch("hsn_code")]);

  // ----------- SUBMIT ------------
  function onSubmit(values: z.infer<typeof itemSchema>) {
    updateItem({ id, ...values });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Edit Item" />
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-6 gap-4">
              <input type="hidden" {...form.register("barcode")} />
              <input type="hidden" {...form.register("qrcode")} />

              {/* USER ID */}
              <div className="col-span-3" hidden>
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />
              </div>

              {/* ITEM NAME */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="item_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Item Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ITEM CODE (HSN) */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="hsn_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Item Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* UNIT */}
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Unit" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* BARCODE + QR PREVIEW */}
              <div className="col-span-6 p-4 border rounded bg-gray-50">
                <p className="text-sm font-semibold mb-2">Barcode Preview</p>
                <svg ref={barcodeRef} />

                <p className="text-sm font-semibold mt-4 mb-2">
                  QR Code Preview
                </p>
                <div className="bg-white w-fit p-2 rounded">
                  <QRCodeSVG
                    value={form.getValues("qrcode") || ""}
                    size={130}
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
