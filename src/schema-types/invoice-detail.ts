import type { InvoiceDetail } from "./invoice-schema";

export type InvoiceRowRedux = Omit<InvoiceDetail, "discountSource"> & {
  lastEdited?: "discountPer" | "discountAmt" | "taxPer" | "taxAmt";
  discountSource?: "bill" | "item";
};
