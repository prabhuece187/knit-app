import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetOutwardQuery } from "@/api/OutwardApi";
import { Link, useNavigate } from "react-router-dom";
import type { Outward } from "@/schema-types/outward-schema";
import { getOutwardColumns, searchColumns } from "./constant/outward-config";

export default function Outward() {
  // Pagination & Search Defaults
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  // Fetch outward data
  const {
    data: response,
    isLoading: outwardLoading,
    isError,
  } = useGetOutwardQuery(
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

  const navigate = useNavigate();

  const handleEdit = (outward: Outward) => {
    navigate(`/editoutward/${outward.id}`);
  };

  const handleDelete = (outward: Outward) => {
    console.log("Delete", outward);
  };

  const outwardData = response?.data ?? [];

  const [open, setOpen] = useState(false);

  const columns = getOutwardColumns(handleEdit, handleDelete);

  return (
    <>
        <DataTableCard
          name={"Outward"}
          columns={columns}
          data={outwardData}
          searchColumns={searchColumns}
          loading={outwardLoading}
          open={open}
          setOpen={setOpen}
          isError={isError}
          trigger={
            <Button>
              <Link to="/addoutward">Add Outward</Link>
            </Button>
          }
        />
    </>
  );
}
