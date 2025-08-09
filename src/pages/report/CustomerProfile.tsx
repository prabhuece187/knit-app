import { FileText, User } from "lucide-react";
import ProfileCard from "./common/ProfileCard";
import { useGetCustomerByIdQuery } from "@/api/CustomerApi";

type Props = {
  id: number;
};

export default function CustomerProfile({ id }: Props) {
  const { data: member, isSuccess } = useGetCustomerByIdQuery(id, {
    skip: id === undefined,
  });

  if (!isSuccess || !member) {
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
              <p className="text-muted-foreground">Customer Name</p>
              <p className="font-medium text-foreground">
                {member.customer_name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Mobile Number</p>
              <p className="font-medium text-foreground">
                {member.customer_mobile}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">
                {member.customer_email || "-"}
              </p>
            </div>
          </div>
        }
      />

      <ProfileCard
        headname="Bussiness Details"
        icon={<User className="w-3.5 h-3.5 text-muted-foreground" />} // 14px icon
        content={
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm px-2 py-2 text-left text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground">Gst Number</p>
              <p className="font-medium text-foreground">
                {member.customer_gst_no || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium text-foreground">
                {member.customer_address || "-"}
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
