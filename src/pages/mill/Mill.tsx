
import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getMillColumns, searchColumns } from "./constant/mill-config"; // You’ll need to create this
import AddMill from "./component/AddMill";
import EditMill from "./component/EditMill";
import { useGetMillQuery } from "@/api/MillApi";

export default function Mill() {
  // Listing Mill Values
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  const {
    data: response,
    isLoading: millLoading,
    isError,
  } = useGetMillQuery(
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

  const millData = response?.data ?? [];

  const [open, setOpen] = useState(false);
  const [selectedMillId, setSelectedMillId] = useState<number | null>(null);

  const columns = getMillColumns(setOpen, setSelectedMillId);

  return (
    <>
      <div className="px-2 lg:px-6">
        <DataTableCard
          name={"Mill"}
          columns={columns}
          data={millData}
          searchColumns={searchColumns}
          loading={millLoading}
          open={open}
          setOpen={setOpen}
          isError={isError}
          trigger={
            <Button
              onClick={() => {
                setSelectedMillId(null);
                setOpen(true);
              }}
            >
              Add Mill
            </Button>
          }
        />
      </div>

      {selectedMillId ? (
        <EditMill
          MillId={selectedMillId}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddMill open={open} setOpen={setOpen} />
      )}
    </>
  );
}
