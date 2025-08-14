import { useGetItemByIdQuery } from "@/api/ItemApi";
import ProfileCard from "./common/ProfileCard";
import { FileText } from "lucide-react";

type Props = {
  id: number;
};

export default function ItemProfile({ id }: Props) {
  const { data: item, isSuccess } = useGetItemByIdQuery(id, {
    skip: id === undefined,
  });

  if (!isSuccess || !item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 px-2 py-2 gap-4">
      {/* <div>Customer profile for ID: {id}</div> */}
      <ProfileCard
        headname="General Details"
        icon={<FileText className="w-3.5 h-3.5 text-muted-foreground" />} // 14px icon
        content={
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm px-2 py-2 text-left text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground">Item Name</p>
              <p className="font-medium text-foreground">
                {item.item_name || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Item Code</p>
              <p className="font-medium text-foreground">
                {item.item_code || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Unit</p>
              <p className="font-medium text-foreground">{item.unit || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Description</p>
              <p className="font-medium text-foreground">
                {item.description || "-"}
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
