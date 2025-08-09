import type React from "react";
import { Card, CardContent } from "../ui/card";
import { DataTable } from "../ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import CommonHeader from "../common/CommonHeader";

interface DataTableCardProps<T> {
  name: string;
  loading: boolean;
  isError: boolean;
  columns: ColumnDef<T>[];
  data: T[];
  searchColumns: (keyof T)[];
  trigger?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function DataTableCard<T>({
  name,
  loading,
  isError,
  columns,
  data,
  searchColumns,
  trigger,
}: DataTableCardProps<T>) {
  return (
    <>
      <CommonHeader name={name} trigger={trigger} />
      <Card className="@container/card">
        <CardContent className="pt-1">
          {loading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div className="text-red-500">Failed to load data</div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              searchColumns={searchColumns}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default DataTableCard;
