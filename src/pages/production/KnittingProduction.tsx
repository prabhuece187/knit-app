import DataTableCard from "@/components/custom/DataTableCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { useGetKnittingProductionQuery } from "@/api/KnittingProductionApi";
import { Link, useNavigate } from "react-router-dom";

import type { KnittingProduction } from "@/schema-types/production-schema";
import {
  getKnittingProductionColumns,
  searchColumns,
} from "./constant/knitting-production-config";

export default function KnittingProduction() {
  const limit = 10;
  const offset = 0;
  const curpage = 1;
  const searchInput = "";

  const {
    data: response,
    isLoading,
    isError,
  } = useGetKnittingProductionQuery({
    limit,
    offset,
    curpage,
    searchInput,
  });

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleEdit = (row: KnittingProduction) => {
    navigate(`/knitting_production_edit/${row.id}`);
  };

  const handleDelete = (row: KnittingProduction) => {
    console.log("Delete", row);
  };

  const data = response?.data ?? [];
  const columns = getKnittingProductionColumns(handleEdit, handleDelete);

  return (
    <DataTableCard
      name="Knitting Production"
      columns={columns}
      data={data}
      searchColumns={searchColumns}
      loading={isLoading}
      open={open}
      setOpen={setOpen}
      isError={isError}
      trigger={
        <Button>
          <Link to="/add-knitting-production">Add Production</Link>
        </Button>
      }
    />
  );
}
