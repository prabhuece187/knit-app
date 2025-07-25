import { useGetStateQuery } from "@/api/StateApi";
import DataTableCard from "@/components/custom/DataTableCard";
import { useState} from "react";
import { Button } from "@/components/ui/button";
import {  getStateColumns, searchColumns } from "./constant/state-config";
import AddState from "./component/AddState";
import EditState from "./component/EditState";

export default function State() {
  //  Listing Customer Values
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  const {
    data: response, // fallback to [] if undefined
    isLoading: stateLoading,
    isError,
  } = useGetStateQuery(
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

  const stateData = response?.data ?? [];

  const [open, setOpen] = useState(false);

  const [selectedStateId, setSelectedStateId] = useState<number | null>(
    null
  );

    const columns = getStateColumns(setOpen, setSelectedStateId);

  return (
    <>
        <DataTableCard
          name={"State"}
          columns={columns}
          data={stateData}
          searchColumns={searchColumns}
          loading={stateLoading}
          open={open}
          setOpen={setOpen}
          isError={isError}
          trigger={
            <Button
              onClick={() => {
                setSelectedStateId(null);
                setOpen(true);
              }}
            >
              Add State
            </Button>
          }
        />

      {selectedStateId ? (
        <EditState
          StateId={selectedStateId}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddState open={open} setOpen={setOpen} />
      )}
    </>
  );
}


