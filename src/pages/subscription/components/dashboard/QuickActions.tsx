import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { isPaymentMethodRestricted } from "../../utils/helpers";
import type { SubscriptionResponse, PaymentMethod } from "../../types";

interface QuickActionsProps {
  subscription: SubscriptionResponse;
  onUpgrade: () => void;
  onDowngrade: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  subscription,
  onUpgrade,
  onDowngrade,
}) => {
  const isRestricted = isPaymentMethodRestricted(
    subscription.payment_method as PaymentMethod
  );

  return (
    <Card className="py-5">
      <CardHeader>
        <CardTitle>Update Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-5">
        {isRestricted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Plan Updates Not Available
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Subscription updates are not available for{" "}
                  {subscription.payment_method?.toUpperCase()} payment methods.
                  Please contact support for assistance.
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={onUpgrade}
          disabled={isRestricted}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={onDowngrade}
          disabled={isRestricted}
        >
          <TrendingUp className="w-4 h-4 mr-2 rotate-180" />
          Downgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
};
