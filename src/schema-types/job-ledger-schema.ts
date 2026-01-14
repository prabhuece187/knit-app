import z from "zod";

export const ledgerEntrySchema = z.object({
  id: z.number().optional(),
  job_id: z.number().min(1),

  entry_type: z.enum(["inward", "outward", "return", "adjustment"]),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  qty: z.number().min(0).optional(),
  weight: z.number().min(0.1),

  description: z.string().optional(),
});

export type LedgerEntry = z.infer<typeof ledgerEntrySchema>;
