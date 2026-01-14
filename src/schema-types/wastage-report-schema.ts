import z from "zod";

export const wastageReportSchema = z.object({
  job_id: z.number().min(1),

  total_yarn_issued: z.number().min(0.1),
  total_fabric_returned: z.number().min(0.1),
  total_wastage_weight: z.number().min(0).optional(),

  wastage_percent: z.number().optional(),
});
