import { useEffect } from "react";
import {  useForm  } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage  } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useParams } from "react-router-dom";
import { useGetCustomerByIdQuery, usePutCustomerMutation } from "@/app/api/CustomerApi";
import {     
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue 
} from "@/app/components/ui/select";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/Store";
import { Textarea } from "@/app/components/ui/textarea";
import { customerSchema } from "@/app/schema-types/master-schema";


export default function EditCustomer(){
    
     const {states} = useSelector((state: RootState)=>state.StateCode);

    const [putCustomer] = usePutCustomerMutation();


    // PARAMETER VALUE RECEIVED URL
    const { CustomerId } = useParams();

    // PARTICULAR CUSTOMER VALUE RECEIVED
    const { data: member,isSuccess  }
    = useGetCustomerByIdQuery(CustomerId, {
      skip: CustomerId === undefined,
    });


    const form = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            customer_name: "",
            customer_state: "Tamil Nadu",
            customer_state_code:"32",
            user_id:1,
            id:1,
            customer_gst_no: "",
            customer_mobile: "",
            customer_email: "",
            customer_address: "",
        },
    })

    useEffect(() => {
    if (isSuccess && member) {
        form.reset({
        customer_name: member.customer_name ?? "",
        id: member.id ?? "",
        customer_state: member.customer_state ?? "",
        customer_state_code:  member.customer_state_code ?? "32",
        user_id: member.user_id ?? 1,
        customer_gst_no: member.customer_gst_no ?? "",
        customer_mobile: member.customer_mobile ?? "",
        customer_email: member.customer_email ?? "",
        customer_address: member.customer_address ?? "",
        });
    }
    }, [isSuccess, member, form]);


     function onSubmit(values: z.infer<typeof customerSchema>) {
        putCustomer(values);
     }


    return (
        <>
            <div className="bg-muted/50 aspect-video h-12 w-full rounded-lg">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 p-2">
                        <h1> Edit Customer </h1>
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


