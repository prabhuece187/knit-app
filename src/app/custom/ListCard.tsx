import type React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { DataTable } from "../../components/ui/data-table";
import ListHeader from "./ListHeader";
import type { ColumnDef } from "@tanstack/react-table";

interface ListCardProps<T> {
  name: string;
  loading: boolean;
  isError: boolean;
  columns: ColumnDef<T>[];
  data: T[];
  searchColumns: (keyof T)[];
  trigger?:React.ReactNode;
}

 function ListCard<T>(props: ListCardProps<T>){
   return (
        <>
        <ListHeader name={props.name} trigger={props.trigger} />
        <Card className="@container/card">
            <CardContent>
                    {props.loading ? (
                    <div>Loading...</div>
                    ) : props.isError ? (
                    <div className="text-red-500">Failed to load data</div>
                    ) : (
                    <DataTable columns={props.columns} data={props.data} searchColumns={props.searchColumns} />
                    )}
            </CardContent>
        </Card>
        </>
   );
}

export default ListCard;