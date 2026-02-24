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

export const customerQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  customer_name: z.string().optional(),
  customer_mobile: z.string().optional(),
  customer_email: z.string().optional(),
  state_name: z.string().optional(),
});

export type CustomerQuery = z.infer<typeof customerQuerySchema>;

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

export const stateQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  state_name: z.string().optional(),
  state_code: z.string().optional(),
});

export type StateQuery = z.infer<typeof stateQuerySchema>;

// =======================  Item ============================

export const itemSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().min(1, { message: "Please Enter the User Name." }),
  item_name: z.string().min(2, {
    message: "Please Enter the Item Name.",
  }),
  hsn_code: z.string().optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  barcode: z.string().optional(),
  qrcode: z.string().optional(),
});

export type Item = z.infer<typeof itemSchema>;

// Item-specific query schema (extends pagination options)
export const itemQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  // Search / filters
  item_name: z.string().optional(),
  hsn_code: z.string().optional(),
  unit: z.string().optional(),
});

export type ItemQuery = z.infer<typeof itemQuerySchema>;

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

export const millQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  mill_name: z.string().optional(),
  mobile_number: z.string().optional(),
});

export type MillQuery = z.infer<typeof millQuerySchema>;

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

export const yarnTypeQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  // search / filters
  yarn_type: z.string().optional(),
});

export type YarnTypeQuery = z.infer<typeof yarnTypeQuerySchema>;

// ======================== Dynamic Add ==========================
export type LabelType =
  | "State"
  | "Customer"
  | "Item"
  | "Mill"
  | "YarnType"
  | "Bank";

// =======================  Bank ============================
export const bankSchema = z.object({
  id: z.number().optional(), // optional if new record
  user_id: z.number().min(1, { message: "Please select a User." }),
  bank_name: z.string().min(2, { message: "Please enter the Bank Name." }),
  branch_name: z.string().optional(),
  account_holder_name: z.string().optional(),
  account_number: z.string().optional(),
  ifsc_code: z.string().optional(),
  bank_city: z.string().optional(),
  bank_state: z.string().optional(),
  bank_email: z
    .string()
    .email({ message: "Invalid email address." })
    .optional(),
  bank_mobile: z.string().optional(),
  bank_address: z.string().optional(),
  is_default: z.boolean().default(false),
});

export type Bank = z.infer<typeof bankSchema>;

export const bankQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  // search
  bank_name: z.string().optional(),
});

export type BankQuery = z.infer<typeof bankQuerySchema>;

// =======================  Job master ============================

export const jobMasterBaseSchema = z.object({
  user_id: z.number().optional(),

  job_card_no: z.string().min(1, "Job No is required"),

  job_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),

  inward_id: z.number().min(1, "Select Inward"),

  customer_id: z.number().min(1, "Select Customer"),

  mill_id: z.number().min(1, "Select Mill"),

  approx_job_weight: z
    .number()
    .positive("Weight must be greater than 0")
    .optional(),

  expected_delivery_date: z.string().optional(),

  remarks: z.string().optional(),

  status: z.enum(["open", "completed", "cancelled"]),
});

export const createJobMasterSchema = jobMasterBaseSchema;
export type CreateJobMaster = z.infer<typeof createJobMasterSchema>;

export const jobMasterSchema = jobMasterBaseSchema.extend({
  id: z.number(), // ✅ REQUIRED
});

export type JobMaster = z.infer<typeof jobMasterSchema>;


export const jobMasterQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

export type JobMasterQuery = z.infer<typeof jobMasterQuerySchema>;

export type JobMasterWithRelations = JobMaster & {
  inward?: {
    id?: number;
    inward_no?: string;
  };
  customer?: {
    id?: number;
    customer_name?: string;
  };
  mill?: {
    id?: number;
    mill_name?: string;
  };
};

// =======================  Knitting Machine ============================

export const knittingMachineSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),

  machine_no: z.string().min(1, "Machine No is required"),
  brand: z.string().optional(),
  machine_name: z.string().optional(),
  feeder: z.number().nullable().optional(),
  model: z.string().optional(),

  dia: z.number().nullable().optional(),
  gauge: z.number().nullable().optional(),

  // 🔥 REQUIRED, NOT OPTIONAL
  status: z.enum(["active", "maintenance", "inactive"]),
});

export type KnittingMachine = z.infer<typeof knittingMachineSchema>;

export const knittingMachineQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  
  // Serch fields
  machine_no: z.string().optional(),
  brand: z.string().optional(),
  dia: z.string().optional(),
  gauge: z.string().optional(),
  status: z.string().optional(),
});

export type KnittingMachineQuery = z.infer<typeof knittingMachineQuerySchema>;
