
import { useGetMillByIdQuery } from "@/api/MillApi";
import ProfileCard from "./common/ProfileCard";
import { FileText } from "lucide-react";

type Props = {
  id: number;
};

export default function MillProfile({ id }: Props) {
  const { data: mill, isSuccess } = useGetMillByIdQuery(id, {
    skip: id === undefined,
  });

  if (!isSuccess || !mill) {
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
              <p className="text-muted-foreground">Mill Name</p>
              <p className="font-medium text-foreground">
                {mill.mill_name || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Mill Mobile</p>
              <p className="font-medium text-foreground">
                {mill.mobile_number || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium text-foreground">{mill.address || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Description</p>
              <p className="font-medium text-foreground">
                {mill.description || "-"}
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
