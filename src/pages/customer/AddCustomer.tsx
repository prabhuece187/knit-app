
import {  useForm  } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { usePostCustomerMutation } from "@/api/CustomerApi";
import { useSelector } from "react-redux";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import type { RootState } from "@/store/Store";
import { Textarea } from "@/components/ui/textarea";
import  { customerSchema } from "@/schema-types/master-schema";
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage  } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

import { useRef } from "react";
import AddUpdateCard from "@/components/custom/AddUpdateCard";

export default function AddCustomer(){
    const formRef = useRef<HTMLFormElement>(null); 
    const {states} = useSelector((state: RootState)=>state.StateCode);
    const [postCustomer] = usePostCustomerMutation();

    const form = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
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
 
    function onSubmit(values: z.infer<typeof customerSchema>) {
        postCustomer(values);
    }

    return (
        <>

            <div className="px-4 lg:px-6">
                <AddUpdateCard name="Add Customer" 
                         onSave={() => formRef.current?.requestSubmit()}>
                   
                   <div className="grid grid-cols-12 px-4 py-4">
                        <div className="col-span-12 md:col-start-4 md:col-span-6">
                            <Card className="rounded-2xl shadow-xl border border-border ">
                                <CardContent>
                                    <Form {...form}>
                                        <form  ref={formRef}
                                               onSubmit={form.handleSubmit(onSubmit)}
                                               className="space-y-8">
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
                                                {/* <div className="col-span-12 flex justify-end">
                                                    <Button type="submit" className="m-2">Cancel</Button>
                                                    <Button type="submit" className="m-2">Submit</Button>
                                                </div> */}
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </AddUpdateCard>
            </div>
        
        </>
    );
}

