import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getItemColumns, searchColumns } from "./constant/item-config";
import EditItem from "./component/EditItem";
import AddItem from "./component/AddItem";
import { useGetItemQuery } from "@/api/ItemApi";

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
  } = useGetItemQuery(
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

  const itemData = response?.data ?? [];

  const [open, setOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const columns = getItemColumns(setOpen, setSelectedItemId);

  return (
    <>
        <DataTableCard
          name={"State"}
          columns={columns}
          data={itemData}
          searchColumns={searchColumns}
          loading={stateLoading}
          open={open}
          setOpen={setOpen}
          isError={isError}
          trigger={
            <Button
              onClick={() => {
                setSelectedItemId(null);
                setOpen(true);
              }}
            >
              Add Item
            </Button>
          }
        />

      {selectedItemId ? (
        <EditItem itemId={selectedItemId} open={open} setOpen={setOpen} />
      ) : (
        <AddItem open={open} setOpen={setOpen} />
      )}
    </>
  );
}
