import { useGetCustomerByIdQuery, useGetCustomerQuery, usePutCustomerMutation } from "@/api/CustomerApi";
import type { ColumnDef } from "@tanstack/react-table";
import  { customerSchema } from "@/schema-types/master-schema";
import { DataTableRowActions } from "@/components/common/DataTableRowAction";
import { DataTableColumnHeader } from "@/components/common/DataTableColumnHeader";
import type z from "zod";
import ListCard from "@/components/custom/ListCard";
import { AlertDialog, AlertDialogContent,} from "@/components/ui/alert-dialog";
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage  } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/Store";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostCustomerMutation } from "@/api/CustomerApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AddUpdateHeader from "@/components/custom/AddUpdateHeader";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomerProps {
    name: string;
}

//Datatable Coloumns Set
export const columns: ColumnDef<customerSchema>[]= [
    {
        accessorKey: "id",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Id" />
        ),
    },
    {
        accessorKey: "customer_name",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Customer Name" />
        ),
    },
    {
        accessorKey: "customer_state",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="State" />
        ),
    },
    {
        accessorKey: "customer_gst_no",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Gst Number" />
        ),
    },
    {
        accessorKey: "customer_mobile",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mobile Number" />
        ),
    },
    {
        accessorKey: "customer_email",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
     {
        accessorKey: "customer_address",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Address" />
        ),
    },
    {
    id: "actions",
          cell: ({ row }) => <DataTableRowActions row={row} />,
    },
    
];

//Datatable Search Option
type Customer = z.infer<typeof customerSchema>


const searchColumns = customerSchema.keyof().options as (keyof Customer)[]

export default function Customer({ name }: CustomerProps){

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
    });

    //  Listing Customer Values
    const limit:number  = 10;
    const offset:number  = 0;
    const curpage:number  = 1;
    const searchInput:string = "";

    const {
            data: response, // fallback to [] if undefined
            isLoading: customerLoading,
            isError,
          } = useGetCustomerQuery({
            limit,
            offset,
            curpage,
            searchInput,
            },
            {
            skip: limit === 0 && offset === 0 && curpage === 0 && searchInput === "",
          });

    const customerData = response?.data ?? [];

    const [postCustomer] = usePostCustomerMutation();
    
    // PARAMETER VALUE RECEIVED URL
    const { CustomerId } = useParams();

    const { data: member,isSuccess  }
        = useGetCustomerByIdQuery(CustomerId, {
          skip: CustomerId === undefined,
    });

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

    const [putCustomer] = usePutCustomerMutation();

    // State Name feature slicer
    const {states} = useSelector((state: RootState)=>state.StateCode);

    // AlertBox Cancel State
    const [open, setOpen] = useState(false);

    //Form Submitting
    async function onSubmit(values: z.infer<typeof customerSchema>) {
        try {
            if (CustomerId) {
            await putCustomer(values).unwrap();
            } else {
            await postCustomer(values).unwrap();
            }
            setOpen(false); // close dialog after successful save
        } catch (error) {
            console.error("Failed to submit:", error);
        }
    }
    
    //Alert Box Header 
    name = CustomerId ? "Edit Customer" : "Add Customer";

    return (
        <>
            <div className="px-2 lg:px-6">
                <ListCard 
                    name={"Customer"}
                    columns={columns} 
                    data={customerData} 
                    searchColumns={searchColumns}
                    loading={customerLoading}
                    isError={isError}
                    trigger={<Button onClick={() => setOpen(true)}>Add Customer</Button>}
                />
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}> 
                <AlertDialogContent>
                    <AddUpdateHeader name={name} onSave={() => form.handleSubmit(onSubmit)()} onCancel={() => setOpen(false)}/>
                            {/* <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter> */}
                            <div className="grid grid-cols-12 px-4 py-4">
                                <div className="col-span-12">
                                    <Card className="rounded-2xl shadow-xl border border-border ">
                                        <CardContent>
                                            <Form {...form}>
                                                <form id="customer-form"  
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
                        </AlertDialogContent>
            </AlertDialog>
        </>
    );
}