"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent } from "@/components/ui/dialog";

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
      barcode: "",
      qrcode: "",
    },
  });

  const itemName = form.watch("item_name");
  const itemCode = form.watch("hsn_code");

  useEffect(() => {
    const final = itemCode || itemName;
    if (!final) return;

    form.setValue("barcode", final);
    form.setValue("qrcode", final);

    if (barcodeRef.current) {
      barcodeRef.current.innerHTML = "";
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
      <DialogContent
        className="
          w-full max-w-3xl sm:max-w-3xl overflow-y-auto rounded-xl p-0
          [&>button]:top-[5%]
          [&>button]:-translate-y-1/2
          [&>button]:right-4
          [&>button]:rounded-full
          [&>button]:p-1.5
          [&>button]:hover:bg-muted
        "
      >
        {/* Header */}
        <div className="px-6 py-4 pr-12 border-b bg-background">
          <CommonHeader name="Add Item" />
          <p className="text-xs text-muted-foreground">
            Enter Item Details and Generate Barcode and QR Code
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <input type="hidden" {...form.register("barcode")} />
            <input type="hidden" {...form.register("qrcode")} />

            {/* ------- INPUT FIELDS ------- */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="item_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Item Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10"
                        placeholder="Enter Item Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hsn_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Code</FormLabel>
                    <FormControl>
                      <Input
                        className="h-10"
                        placeholder="Enter Item Code"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input
                        className="h-10"
                        placeholder="Enter Unit"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div></div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder="Enter Description"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* ------- PREVIEW ------- */}
              <div className="col-span-2">
                <div className="border rounded-xl p-5 bg-muted/40">
                  <p className="text-sm font-semibold mb-4">
                    Barcode & QR Preview
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Barcode */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-2">
                        Barcode
                      </span>
                      <div className="bg-white border rounded-lg p-4 w-full flex justify-center">
                        <svg ref={barcodeRef} className="w-[280px] h-[80px]" />
                      </div>
                    </div>

                    {/* QR */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-2">
                        QR Code
                      </span>
                      <div className="bg-white border rounded-lg p-4">
                        <QRCodeSVG
                          value={form.getValues("qrcode") || ""}
                          size={140}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="px-6">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
