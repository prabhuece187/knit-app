import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import type { StatusBadgeProps } from "../../types";

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
      case "authenticated":
        return {
          icon: CheckCircle,
          className: "bg-green-100 text-green-800",
          label: "Active",
        };
      case "paused":
        return {
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800",
          label: "Paused",
        };
      case "cancelled":
        return {
          icon: XCircle,
          className: "bg-red-100 text-red-800",
          label: "Cancelled",
        };
      case "completed":
        return {
          icon: CheckCircle,
          className: "bg-gray-100 text-gray-800",
          label: "Completed",
        };
      default:
        return {
          icon: AlertCircle,
          className: "bg-gray-100 text-gray-800",
          label: status,
        };
    }
  };

  const { icon: Icon, className, label } = getStatusConfig();

  return (
    <Badge className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
};
