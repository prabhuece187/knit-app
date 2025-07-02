import { useGetCustomerQuery } from "@/api/CustomerApi";
import { customerSchema } from "@/schema-types/master-schema";
import type z from "zod";
import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import AddCustomer from "./component/AddCustomer";
import { getCustomerColumns, searchColumns } from "./constant/customer-config";
import EditCustomer from "./component/EditCustomer";

type Customer = z.infer<typeof customerSchema>;

export default function Customer() {
  //  Listing Customer Values
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  const {
    data: response, // fallback to [] if undefined
    isLoading: customerLoading,
    isError,
  } = useGetCustomerQuery(
    {
      limit,
      offset,
      curpage,
      searchInput,
    },
    {
      skip: limit === 0 && offset === 0 && curpage === 0 && searchInput === "",
    }
  );

  const customerData = response?.data ?? [];

  const [open, setOpen] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  const columns = getCustomerColumns(setOpen, setSelectedCustomerId);

  return (
    <>
      <div className="px-2 lg:px-6">
        <DataTableCard
          name={"Customer"}
          columns={columns}
          data={customerData}
          searchColumns={searchColumns}
          loading={customerLoading}
          open={open}
          setOpen={setOpen}
          isError={isError}
          trigger={
            <Button
              onClick={() => {
                setSelectedCustomerId(null);
                setOpen(true);
              }}
            >
              Add Customer
            </Button>
          }
        />
      </div>

      {selectedCustomerId ? (
        <EditCustomer
          CustomerId={selectedCustomerId}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddCustomer open={open} setOpen={setOpen} />
      )}
    </>
  );
}
