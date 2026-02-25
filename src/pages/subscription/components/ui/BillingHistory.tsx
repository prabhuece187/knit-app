import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download } from "lucide-react";
import { formatDateRange, formatCurrency } from "../../utils/formatters";
import type { SubscriptionResponse, Plan } from "../../types";

interface BillingHistoryProps {
  subscription: SubscriptionResponse;
  currentPlan: Plan | null;
}

export const BillingHistory: React.FC<BillingHistoryProps> = ({
  subscription,
  currentPlan,
}) => {
  return (
    <Card className="py-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Billing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4  rounded-lg">
            <div>
              <p className="font-medium">Current Period</p>
              <p className="text-sm text-gray-600">
                {formatDateRange(
                  subscription.current_start,
                  subscription.current_end
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {formatCurrency(currentPlan?.price || 0)}
              </p>
              <Badge variant="secondary">Paid</Badge>
            </div>
          </div>

          <div className="text-center py-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
