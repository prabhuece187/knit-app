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
import { usePostItemMutation } from "@/api/ItemApi";

import { QRCodeSVG } from "qrcode.react";
import JsBarcode from "jsbarcode";

export default function AddItem({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [postItem] = usePostItemMutation();
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      user_id: 1,
      barcode: "",
      qrcode: "",
    },
  });

  // Auto Barcode & QR Generate
  const itemName = form.watch("item_name");
  const itemCode = form.watch("hsn_code");

  useEffect(() => {
    const final = itemCode || itemName;
    if (!final) return;

    form.setValue("barcode", final);
    form.setValue("qrcode", final);

    if (barcodeRef.current) {
      barcodeRef.current.innerHTML = ""; // Clear old barcode
      JsBarcode(barcodeRef.current, final, {
        format: "CODE128",
        displayValue: true,
        fontSize: 14,
        lineColor: "#111",
      });
    }
  }, [itemName, itemCode]);

  function onSubmit(values: z.infer<typeof itemSchema>) {
    postItem(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* WIDE DIALOG */}
      <DialogContent className="w-full max-w-5xl sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            <CommonHeader name="Add Item" />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...form.register("barcode")} />
            <input type="hidden" {...form.register("qrcode")} />

            {/* ------- INPUT FIELDS ------- */}
            <div className="grid grid-cols-6 gap-4">
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
                    </FormItem>
                  )}
                />
              </div>

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

              {/* ------- BARCODE + QR PREVIEW ------- */}
              <div className="col-span-6 mt-4">
                <div className="bg-gray-50 border rounded-xl p-5 shadow-sm">
                  <p className="text-base font-semibold mb-4">
                    Barcode & QR Preview
                  </p>

                  <div className="grid grid-cols-2 gap-8">
                    {/* LEFT — BARCODE */}
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium mb-2">Barcode</p>
                      <div className="bg-white rounded-lg shadow p-4 w-full flex justify-center">
                        <svg
                          ref={barcodeRef}
                          className="w-[300px] h-[90px]"
                        ></svg>
                      </div>
                    </div>

                    {/* RIGHT — QR CODE */}
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium mb-2">QR Code</p>
                      <div className="bg-white rounded-lg shadow p-4">
                        <QRCodeSVG
                          value={form.getValues("qrcode") || ""}
                          size={160}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------- BUTTONS ------- */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
