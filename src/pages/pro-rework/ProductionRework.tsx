"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DataTableCard from "@/components/custom/DataTableCard";

import EditProductionRework from "./component/EditProductionRework";

import { useGetReworksQuery } from "@/api/ProductionReworkApi";
import {
  getKnittingReworkColumns,
  searchColumns,
} from "./constant/pro-rework-config";
import AddProductionRework from "./component/AddProductionRework";

export default function KnittingRework() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, isError } = useGetReworksQuery({
    limit: 10,
    offset: 0,
    curpage: 1,
    searchInput: "",
  });

  const reworkData = data?.data ?? [];

  const columns = getKnittingReworkColumns(setOpen, setSelectedId);

  return (
    <>
      <DataTableCard
        name="Knitting Rework"
        columns={columns}
        data={reworkData}
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
            Add Rework
          </Button>
        }
      />

      {selectedId && reworkData.find((r) => r.id === selectedId) ? (
        <EditProductionRework
          data={reworkData.find((r) => r.id === selectedId)!}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddProductionRework open={open} setOpen={setOpen} />
      )}
    </>
  );
}
