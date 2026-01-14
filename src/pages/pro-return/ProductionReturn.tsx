"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DataTableCard from "@/components/custom/DataTableCard";
import AddProductionReturn from "./component/AddProductionReturn";
import { useGetReturnsQuery } from "@/api/ProductionReturnApi";
import EditProductionReturn from "./component/EditProductionReturn";
import {
  getProductionReturnColumns,
  searchColumns,
} from "./constant/pro-return-config";

export default function ProductionReturn() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, isError } = useGetReturnsQuery({
    limit: 10,
    offset: 0,
    curpage: 1,
    searchInput: "",
  });

  const returnData = data?.data ?? [];
  

  const columns = getProductionReturnColumns(setOpen, setSelectedId);

  return (
    <>
      <DataTableCard
        name="Fabric Return"
        columns={columns}
        data={returnData}
        searchColumns={searchColumns}
        loading={isLoading}
        isError={isError}
        open={open}
        setOpen={setOpen}
        trigger={
          <Button
            onClick={() => {
              setSelectedId(null);
              setOpen(true);
            }}
          >
            Add Fabric Return
          </Button>
        }
      />

      {selectedId && returnData.find((r) => r.id === selectedId) ? (
        <EditProductionReturn
          data={returnData.find((r) => r.id === selectedId)!}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddProductionReturn open={open} setOpen={setOpen} />
      )}
    </>
  );
}
