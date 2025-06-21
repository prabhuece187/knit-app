
import {  useForm  } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/layout/components/ui/form";
import { Input } from "@/app/layout/components/ui/input";
import { Button } from "@/app/layout/components/ui/button";
import { usePostCustomerMutation } from "@/app/service/CustomerApi";
import { useSelector } from "react-redux";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/app/layout/components/ui/select";
import type { RootState } from "@/app/store/Store";
import { Textarea } from "@/app/layout/components/ui/textarea";

const formSchema = z.object({
  customer_name: z.string().min(2, {
    message: "Please Enter the Customer Name.",
  }),
  customer_state: z.string().min(1, { message: 'Please Enter the State Name.' }), 
  customer_state_code: z.string().min(1, { message: 'Please Enter the State Name.' }), 
  user_id: z.number().min(1, { message: 'Please Enter the State Code.' }), 
  customer_gst_no: z.string().min(15, { message: 'Please Enter the Gst Number.' }),
  customer_mobile: z.string().optional(),
  customer_email: z.string().email("Please Enter the Valid email").optional(),
  customer_address: z.string().optional(),
})

export default function AddCustomer(){
    
    const {states} = useSelector((state: RootState)=>state.StateCode);
    const [postCustomer] = usePostCustomerMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customer_name: "",
            customer_state: "Tamil Nadu",
            customer_state_code: "32",
            user_id:1,
            customer_gst_no: "",
            customer_mobile: "",
            customer_email: "",
            customer_address: "",
        },
    })
 
    function onSubmit(values: z.infer<typeof formSchema>) {
        postCustomer(values);
    }

    return (
        <>
            <div className="bg-muted/50 aspect-video h-12 w-full rounded-lg">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 p-2">
                        <h1> Add Customer </h1>
                    </div>
                </div>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-3">
                            <FormField
                            control={form.control}
                            name="customer_name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Customer Name*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the Customer Name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="col-span-3">
                            <FormField
                                control={form.control}
                                name="customer_state"
                                render={({ 
                                    field 
                                }) => (
                                    <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <Select 
                                    onValueChange={(value) => {
                                            field.onChange(value); 
                                            form.setValue("customer_state_code", value); 
                                        }} 
                                    defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a State Name" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                           {states.map((state: { value: string; label: string }) => (
                                                <SelectItem key={state.value} value={state.value}>
                                                {state.value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>

                        <div className="col-span-3">
                            <FormField
                            control={form.control}
                            name="customer_gst_no"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>GST Number*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the GST Number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="col-span-3">
                            <FormField
                            control={form.control}
                            name="customer_mobile"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the Mobile Number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="col-span-3">
                            <FormField
                            control={form.control}
                            name="customer_email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the Email" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        <div className="col-span-3">
                            <FormField
                                control={form.control}
                                name="customer_address"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Enter the Address"
                                        className="resize-none"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 flex justify-end">
                            <Button type="submit" className="m-2">Cancel</Button>
                            <Button type="submit" className="m-2">Submit</Button>
                        </div>
                    </div>

                </form>
            </Form>

        </>
    );
}

