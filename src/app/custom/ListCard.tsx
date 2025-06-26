import { Card, CardContent, CardHeader } from "../components/ui/card";
import { DataTable } from "../components/ui/data-table";
import ListHeader from "./ListHeader";
import type { ColumnDef } from "@tanstack/react-table";

interface ListCardProps<T> {
  name: string;
  loading: boolean;
  isError: boolean;
  columns: ColumnDef<T>[];
  data: T[];
  searchColumns: (keyof T)[];
}

 function ListCard<T>(props: ListCardProps<T>){
   return (
        <>
        <Card className="@container/card">
            <CardHeader>
                <ListHeader name={props.name} />
            </CardHeader>

            <CardContent>
                <div className="px-4">
                    {props.loading ? (
                    <div>Loading...</div>
                    ) : props.isError ? (
                    <div className="text-red-500">Failed to load data</div>
                    ) : (
                    <DataTable columns={props.columns} data={props.data} searchColumns={props.searchColumns} />
                    )}
                </div>
            </CardContent>
        </Card>
        </>
   );
}

export default ListCard;