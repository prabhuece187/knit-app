import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "../../store/Store";
import { useSubscription } from "./hooks/useSubscription";
import { useSubscriptionActions } from "./hooks/useSubscriptionActions";
import { usePayment } from "./hooks/usePayment";
import { DashboardView } from "./components/dashboard/DashboardView";
import { PlansView } from "./components/plans/PlansView";
import { LoadingState } from "./components/shared/LoadingState";
import { ErrorState } from "./components/shared/ErrorState";
import { SubscriptionService } from "./services/subscription.service";
import { getPlanById } from "./utils/helpers";
import { plans } from "./config/plans.config";
import { formatCurrency } from "./utils/formatters";
import type { SubscriptionView } from "./types";
import type { RootState } from "../../store/Store";

const SubscriptionPage: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [currentView, setCurrentView] = useState<SubscriptionView>("dashboard");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Data layer
  const { subscription, currentPlan, isLoading, error } = useSubscription();

  // Actions layer
  const subscriptionActions = useSubscriptionActions(subscription);
  const { initiatePayment, isProcessing: isPaymentProcessing } = usePayment();

  const isProcessing = subscriptionActions.isProcessing || isPaymentProcessing;

  /**
   * Handle plan selection
   */
  const handlePlanSelect = useCallback((planId: string) => {
    setSelectedPlanId(planId);
    setShowConfirmation(true);
  }, []);

  /**
   * Handle view navigation
   */
  const navigateToDashboard = useCallback(() => {
    setCurrentView("dashboard");
    setSelectedPlanId("");
  }, []);

  const navigateToPlans = useCallback(() => {
    setCurrentView("plans");
  }, []);

  /**
   * Handle subscription creation (new subscription)
   */
  const handleCreateSubscription = useCallback(async () => {
    if (!user || !selectedPlanId) return;

    const selectedPlan = getPlanById(plans, selectedPlanId);
    if (!selectedPlan) {
      toast.error("Selected plan not found");
      return;
    }

    try {
      setShowConfirmation(false);

      // Build request
      const request = SubscriptionService.buildCreateRequest(
        user.id,
        selectedPlan,
        user.email
      );

      // Create subscription
      const result = await subscriptionActions.createSubscription(request);

      // Launch payment
      await initiatePayment(result.id, selectedPlan);

      setSelectedPlanId("");
    } catch (error) {
      // Error already handled in hooks
      console.error("Subscription creation error:", error);
    }
  }, [user, selectedPlanId, subscriptionActions, initiatePayment]);

  /**
   * Handle subscription update (change plan)
   */
  const handleUpdateSubscription = useCallback(async () => {
    if (!selectedPlanId) return;

    try {
      setShowConfirmation(false);
      await subscriptionActions.updateSubscription(selectedPlanId);
      setSelectedPlanId("");
      // Optionally navigate back to dashboard
      setTimeout(() => navigateToDashboard(), 1500);
    } catch (error) {
      // Error already handled in hooks
      console.error("Subscription update error:", error);
    }
  }, [selectedPlanId, subscriptionActions, navigateToDashboard]);

  /**
   * Handle confirmation action
   */
  const handleConfirm = useCallback(() => {
    if (subscription) {
      handleUpdateSubscription();
    } else {
      handleCreateSubscription();
    }
  }, [subscription, handleUpdateSubscription, handleCreateSubscription]);

  // Render loading state
  if (isLoading) {
    return <LoadingState message="Loading subscription details..." />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorState
        message="Failed to load subscription details"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Get selected plan details for confirmation
  const selectedPlan = selectedPlanId
    ? getPlanById(plans, selectedPlanId)
    : null;

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView === "plans" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToDashboard}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              )}
              <h1 className="text-2xl font-bold">
                {currentView === "dashboard"
                  ? "Subscription Management"
                  : "Choose Your Plan"}
              </h1>
            </div>

            {/* Quick Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToDashboard}
                className={currentView === "dashboard" ? "bg-gray-100" : ""}
              >
                <Settings className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToPlans}
                className={currentView === "plans" ? "bg-gray-100" : ""}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Plans
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {currentView === "dashboard" ? (
          subscription ? (
            <DashboardView
              subscription={subscription}
              currentPlan={currentPlan}
              onUpgrade={navigateToPlans}
              onDowngrade={navigateToPlans}
              onPause={subscriptionActions.pauseSubscription}
              onResume={subscriptionActions.resumeSubscription}
              onCancel={subscriptionActions.cancelSubscription}
              isProcessing={isProcessing}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-6 text-center">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Active Subscription
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have an active subscription. Choose a plan to get
                    started.
                  </p>
                  <Button onClick={navigateToPlans}>View Plans</Button>
                </CardContent>
              </Card>
            </div>
          )
        ) : (
          <PlansView
            currentPlanId={subscription?.plan_id}
            onPlanSelect={handlePlanSelect}
          />
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 px-5 pb-5">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {subscription
                    ? "Update Subscription Plan"
                    : "Confirm Plan Selection"}
                </h3>

                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    {subscription ? (
                      <>
                        You're updating from{" "}
                        <span className="font-semibold">
                          {currentPlan?.name || "Current Plan"}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                          {selectedPlan.name}
                        </span>
                        .
                      </>
                    ) : (
                      <>
                        You've selected the{" "}
                        <span className="font-semibold">
                          {selectedPlan.name}
                        </span>{" "}
                        plan.
                      </>
                    )}
                  </p>

                  <div className="p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedPlan.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-semibold">
                        {selectedPlan.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Period:</span>
                      <span className="font-semibold capitalize">
                        {selectedPlan.period}
                      </span>
                    </div>
                    {subscription && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Changes will take effect at the end of your current
                          billing cycle.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowConfirmation(false);
                      setSelectedPlanId("");
                    }}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    {subscription ? "Update Plan" : "Proceed to Payment"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
