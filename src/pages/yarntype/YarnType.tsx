import { useGetYarnTypeQuery } from "@/api/YarnTypeApi";
import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddYarnType from "./component/AddYarnType";
import EditYarnType from "./component/EditYarnType";
import { getYarnTypeColumns, searchColumns } from "./constant/yarntype-config";

export default function YarnType() {
  // Listing Yarn Type Values
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  const {
    data: response,
    isLoading: yarnTypeLoading,
    isError,
  } = useGetYarnTypeQuery(
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

  const yarnTypeData = response?.data ?? [];

  const [open, setOpen] = useState(false);

  const [selectedYarnTypeId, setSelectedYarnTypeId] = useState<number | null>(
    null
  );

  const columns = getYarnTypeColumns(setOpen, setSelectedYarnTypeId);

  return (
    <>
        <DataTableCard
          name={"Yarn Type"}
          columns={columns}
          data={yarnTypeData}
          searchColumns={searchColumns}
          loading={yarnTypeLoading}
          open={open}
          setOpen={setOpen}
          isError={isError}
          trigger={
            <Button
              onClick={() => {
                setSelectedYarnTypeId(null);
                setOpen(true);
              }}
            >
              Add Yarn Type
            </Button>
          }
        />

      {selectedYarnTypeId ? (
        <EditYarnType
          yarnTypeId={selectedYarnTypeId}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <AddYarnType open={open} setOpen={setOpen} />
      )}
    </>
  );
}
