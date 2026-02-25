import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { PlanCard } from "../ui/PlanCard";
import { plans } from "../../config/plans.config";

interface PlansViewProps {
  currentPlanId?: string;
  onPlanSelect: (planId: string) => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  currentPlanId,
  onPlanSelect,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = () => {
    if (selectedPlanId) {
      onPlanSelect(selectedPlanId);
    }
  };

  const planEntries = Object.values(plans);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your professional directory needs.
            Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Current Plan Badge */}
        {currentPlanId && (
          <div className="text-center mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              You currently have an active subscription
            </Badge>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {planEntries.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              isCurrentPlan={currentPlanId === plan.id}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Action Button */}
        {selectedPlanId && (
          <div className="text-center">
            <Button
              size="lg"
              className="px-8 py-3 text-lg"
              onClick={handleContinue}
            >
              Continue with Selected Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
