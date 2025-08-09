import { useGetCustomerQuery } from "@/api/CustomerApi";
import DataTableCard from "@/components/custom/DataTableCard";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import AddCustomer from "./component/AddCustomer";
import { getCustomerColumns, searchColumns } from "./constant/customer-config";
import EditCustomer from "./component/EditCustomer";
// import { useOutletContext } from "react-router-dom";
import type { Customer, customerSchema } from "@/schema-types/master-schema";
import type z from "zod";

export type APIResponseCustomer = z.infer<typeof customerSchema>;

export default function Customer() {
  // Listing Customer Values
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  // const { setSidebarContent } = useOutletContext<OutletContext>();

  const {
    data: response,
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

  const rawData = useMemo<APIResponseCustomer[]>(() => {
    return Array.isArray(response?.data)
      ? response.data
      : response?.data
      ? [response.data]
      : [];
  }, [response?.data]);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = getCustomerColumns(setOpen, setSelectedId);

  return (
    <>
      <DataTableCard
        name={"Customer"}
        columns={columns}
        data={rawData}
        searchColumns={searchColumns}
        loading={customerLoading}
        open={open}
        setOpen={setOpen}
        isError={isError}
        trigger={
          <Button
            onClick={() => {
              setSelectedId(null);
              setOpen(true);
            }}
          >
            + Add Customer
          </Button>
        }
      />

      {selectedId ? (
        <EditCustomer id={selectedId} open={open} setOpen={setOpen} />
      ) : (
        <AddCustomer open={open} setOpen={setOpen} />
      )}
    </>
  );
}
