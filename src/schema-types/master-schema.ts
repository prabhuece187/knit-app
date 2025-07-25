import z from "zod";

// =======================  customer ============================
export const customerSchema = z.object({
  id: z.coerce.number().optional(),
  customer_name: z.string().min(2, {
    message: "Please Enter the Customer Name.",
  }),
  state_id: z.coerce
    .number()
    .min(1, { message: "Please Enter the State Name." }),
  user_id: z.coerce
    .number()
    .min(1, { message: "Please Enter the User Name.." }),
  customer_gst_no: z
    .string()
    .min(15, { message: "Please Enter the Gst Number." }),
  customer_mobile: z.string().optional(),
  customer_email: z.string().email("Please Enter the Valid email").optional(),
  customer_address: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>;

// =======================  State ============================

export const stateSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, { message: "Please Enter User Name.." }),
  state_name: z.string().min(2, {
    message: "Please Enter the State Name.",
  }),
  state_code: z.coerce.number().min(2, {
    message: "Please Enter the State Code.",
  }),
});

export type State = z.infer<typeof stateSchema>;

// =======================  Item ============================

export const itemSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, { message: "Please Enter the User Name." }),
  item_name: z.string().min(2, {
    message: "Please Enter the Item Name.",
  }),
  item_code: z.string().optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export type Item = z.infer<typeof itemSchema>;

// =======================  Mill ============================

export const millSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, { message: "Please Enter the User Name." }),
  mill_name: z.string().min(2, {
    message: "Please Enter the Mill Name.",
  }),
  mobile_number: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

export type Mill = z.infer<typeof millSchema>;

// =======================  Yarn Type ============================

export const yarnTypeSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, { message: "Please Enter the User Name." }),
  yarn_type: z.string().min(2, {
    message: "Please Enter the Mill Name.",
  }),
});

export type YarnType = z.infer<typeof yarnTypeSchema>;

export type SidebarRightData = {
  id: number;
  name: string;
  detail: string;
};


// ======================== Dynamic Add ==========================
export type LabelType = "State" | "Customer" | "Item" | "Mill" | "YarnType";