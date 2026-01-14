import DataTableCard from "@/components/custom/DataTableCard";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  getKnittingMachineColumns,
  knittingMachineSearchColumns,
} from "./constant/knitting-machine-config";

import { useGetKnittingMachineQuery } from "@/api/KnittingMachineApi";
import AddKnittingMachine from "./component/AddKnittingMachine";
import EditKnittingMachine from "./component/EditKnittingMachine";

export default function KnittingMachine() {
  const limit = 10;
  const offset = 0;
  const curpage = 1;
  const searchInput = "";

  const { data, isLoading, isError } = useGetKnittingMachineQuery({
    limit,
    offset,
    curpage,
    searchInput,
  });

  const rawData = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = getKnittingMachineColumns(setOpen, setSelectedId);

  return (
    <>
      <DataTableCard
        name="Knitting Machine"
        columns={columns}
        data={rawData}
        searchColumns={knittingMachineSearchColumns}
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
            + Add Machine
          </Button>
        }
      />

      {selectedId ? (
        <EditKnittingMachine id={selectedId} open={open} setOpen={setOpen} />
      ) : (
        <AddKnittingMachine open={open} setOpen={setOpen} />
      )}
    </>
  );
}
