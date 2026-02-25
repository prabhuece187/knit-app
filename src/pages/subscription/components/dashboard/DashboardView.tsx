import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertTriangle } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { SubscriptionStats } from "../ui/SubscriptionStats";
import { BillingHistory } from "../ui/BillingHistory";
import { QuickActions } from "./QuickActions";
import { ManageSubscription } from "./ManageSubscription";
import { formatDate, formatCurrency } from "../../utils/formatters";
import type {
  SubscriptionResponse,
  Plan,
  SubscriptionStatus,
} from "../../types";

interface DashboardViewProps {
  subscription: SubscriptionResponse;
  currentPlan: Plan | null;
  onUpgrade: () => void;
  onDowngrade: () => void;
  onPause: (pauseAt: "now" | "cycle") => Promise<void>;
  onResume: (resumeAt: "now" | "cycle") => Promise<void>;
  onCancel: (cancelAtEnd: boolean) => Promise<void>;
  isProcessing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  subscription,
  currentPlan,
  onUpgrade,
  onDowngrade,
  onPause,
  onResume,
  onCancel,
  isProcessing,
}) => {
  const nextBillingDate = formatDate(subscription.current_end);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-gray-600">
            Manage your subscription, billing, and plan details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan Card */}
            <Card className="p-5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Current Plan
                  </CardTitle>
                  <StatusBadge
                    status={subscription.status as SubscriptionStatus}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {currentPlan?.name || "Unknown Plan"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {currentPlan?.description ||
                        "Plan description not available"}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {formatCurrency(currentPlan?.price || 0)}
                      </span>
                      <span className="text-gray-600">
                        {currentPlan?.duration || "per period"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Next Billing Date
                      </label>
                      <p className="text-lg font-semibold">{nextBillingDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Subscription ID
                      </label>
                      <p className="text-sm text-gray-600 font-mono">
                        {subscription.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Payment Method
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {subscription.payment_method?.toUpperCase() ||
                            "Unknown"}
                        </Badge>
                        {(subscription.payment_method === "upi" ||
                          subscription.payment_method === "emandate") && (
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <BillingHistory
              subscription={subscription}
              currentPlan={currentPlan}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions
              subscription={subscription}
              onUpgrade={onUpgrade}
              onDowngrade={onDowngrade}
            />
            <ManageSubscription
              subscription={subscription}
              onPause={onPause}
              onResume={onResume}
              onCancel={onCancel}
              isProcessing={isProcessing}
            />
            <SubscriptionStats subscription={subscription} />
          </div>
        </div>
      </div>
    </div>
  );
};
