import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getInwardColumns, searchColumns } from "./constant/inward-config";
import { useGetInwardQuery } from "@/api/InwardApi";
import { Link, useNavigate } from "react-router-dom";
import type { Inward } from "@/schema-types/inward-schema";

export default function Inward() {
  // Pagination & Search Defaults
  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  // Fetch inward data
  const {
    data: response,
    isLoading: inwardLoading,
    isError,
  } = useGetInwardQuery(
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

  const handleEdit = (inward: Inward) => {
    navigate(`/editinward/${inward.id}`);
  };

  const handleDelete = (inward: Inward) => {
    console.log("Delete", inward);
  };

  const inwardData = response?.data ?? [];

  const [open, setOpen] = useState(false);
  // const [selectedInwardId] = useState<number | null>(null);

  const columns = getInwardColumns(handleEdit, handleDelete);

  return (
    <>
        <DataTableCard
          name={"Inward"}
          columns={columns}
          data={inwardData}
          searchColumns={searchColumns}
          loading={inwardLoading}
          open={open}
          setOpen={setOpen}
          isError={isError}
          trigger={
            <Button>
              <Link to="/addinward">Add Inward</Link>
            </Button>
          }
        />
    </>
  );
}
