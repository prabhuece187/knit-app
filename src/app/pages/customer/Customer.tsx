import Header from "@/app/custom/Header";
import { DataTable } from "@/app/components/ui/data-table";
import { useGetCustomerQuery } from "@/app/api/CustomerApi";
import type { ColumnDef } from "@tanstack/react-table";
import type { customerSchema } from "@/app/schema-types/master-schema";
import { DataTableRowActions } from "@/app/components/table/DataTableRowAction";
import { DataTableColumnHeader } from "@/app/components/table/DataTableColumnHeader";

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
    
]


export default function Customer(){

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


    return (
        <>
           <Header name={"customer"} />

            <div className="p-4">
                {customerLoading ? (
                <div>Loading...</div>
                ) : isError ? (
                <div className="text-red-500">Failed to load data</div>
                ) : (
                <DataTable columns={columns} data={customerData} />
                )}
            </div>

        </>
    );
}