import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "../../utils/formatters";
import type { SubscriptionStatsProps } from "../../types";

export const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({
  subscription,
}) => {
  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle>Subscription Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Payments</span>
          <span className="font-semibold">{subscription.paid_count}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Remaining</span>
          <span className="font-semibold">{subscription.remaining_count}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Cycles</span>
          <span className="font-semibold">{subscription.total_count}</span>
        </div>
        <Separator />
        <div className="text-center">
          <p className="text-sm text-gray-500">Customer Since</p>
          <p className="font-semibold">
            {formatDate(subscription.current_start)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
