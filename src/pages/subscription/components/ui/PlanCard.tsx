import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateMonthlyPrice } from "../../utils/formatters";
import type { PlanCardProps } from "../../types";

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected,
  onSelect,
  isCurrentPlan,
}) => {
  const isYearly = plan.period === "yearly";
  const isQuarterly = plan.period === "quarterly";

  return (
    <Card
      className={cn(
        "relative  rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl p-5",
        plan.borderColor,
        isSelected && "ring-2 ring-offset-2 ring-purple-500 scale-105",
        isCurrentPlan && "opacity-80"
      )}
    >
      {isYearly && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              plan.color
            )}
          >
            {isYearly ? (
              <Shield className="w-6 h-6 text-white" />
            ) : (
              <CreditCard className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">₹{plan.price}</span>
            <span className="text-gray-600 ml-2">/{plan.duration}</span>
          </div>
          {(isYearly || isQuarterly) && (
            <p className="text-sm text-gray-500 mt-1">
              Just {calculateMonthlyPrice(plan.price, plan.period)} per month
            </p>
          )}
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onSelect(plan.id)}
          disabled={isCurrentPlan}
          className={cn(
            "w-full",
            isSelected
              ? `${plan.color} text-white shadow-lg`
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            isCurrentPlan && "opacity-50 cursor-not-allowed"
          )}
        >
          {isCurrentPlan
            ? "Current Plan"
            : isSelected
            ? "Subscribe Now"
            : `Choose ${plan.name}`}
        </Button>
      </CardFooter>
    </Card>
  );
};
