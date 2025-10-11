
import DataTableCard from "@/components/custom/DataTableCard";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import { getBankColumns, bankSearchColumns } from "./constant/bank-config";
import type { Bank, bankSchema } from "@/schema-types/master-schema";
import type z from "zod";
import { useGetBankQuery } from "@/api/BankApi";
import EditBank from "./component/EditBank";
import AddBank from "./component/AddBank";

export type APIResponseBank = z.infer<typeof bankSchema>;

export default function Bank() {
  // Listing Bank Values
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  const {
    data: response,
    isLoading: bankLoading,
    isError,
  } = useGetBankQuery(
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

  const rawData = useMemo<APIResponseBank[]>(() => {
    return Array.isArray(response?.data)
      ? response.data
      : response?.data
      ? [response.data]
      : [];
  }, [response?.data]);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = getBankColumns(setOpen, setSelectedId);

  return (
    <>
      <DataTableCard
        name={"Bank"}
        columns={columns}
        data={rawData}
        searchColumns={bankSearchColumns}
        loading={bankLoading}
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
            + Add Bank
          </Button>
        }
      />

      {selectedId ? (
        <EditBank id={selectedId} open={open} setOpen={setOpen} />
      ) : (
        <AddBank open={open} setOpen={setOpen} />
      )}
    </>
  );
}
