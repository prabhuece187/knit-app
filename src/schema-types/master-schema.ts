import z from "zod"


// =======================  customer ============================
export const customerSchema = z.object({
  id: z.number().optional(),
  customer_name: z.string().min(2, {
    message: "Please Enter the Customer Name.",
  }),
  state_id: z.number().min(1, { message: 'Please Enter the State Name.' }), 
  user_id: z.number().min(1, { message: 'Please Enter the State Code.' }), 
  customer_gst_no: z.string().min(15, { message: 'Please Enter the Gst Number.' }),
  customer_mobile: z.string().optional(),
  customer_email: z.string().email("Please Enter the Valid email").optional(),
  customer_address: z.string().optional(),
})

export type customerSchema = z.infer<typeof customerSchema>

// =======================  State ============================


export const stateSchema = z.object({
  id: z.number(),
  state_name: z.string().min(2, {
    message: "Please Enter the State Name.",
  }),
});