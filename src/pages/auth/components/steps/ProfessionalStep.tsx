import { User, CheckCircle } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import AuthHeader from "../shared/AuthHeader";
import ProfessionalDetailsForm from "../forms/ProfessionalDetailsForm";
import StepNavigation from "../shared/StepNavigation";
import type { ProfessionalSelectFallbacks } from "../../types/auth.types";
import type { Step1Registration } from "../../types/registration.types";

interface ProfessionalStepProps {
  form: UseFormReturn<Step1Registration>;
  selectOptionFallbacks?: ProfessionalSelectFallbacks;
  onSubmit: (data: Step1Registration) => void;
  onBack: () => void;
  isLoading: boolean;
  isReviewMode?: boolean;
}

export default function ProfessionalStep({
  form,
  selectOptionFallbacks,
  onSubmit,
  onBack,
  isLoading,
  isReviewMode = false,
}: ProfessionalStepProps) {
  return (
    <div className="space-y-6">
      <AuthHeader
        icon={User}
        title="Professional Details"
        description={
          isReviewMode
            ? "Welcome back! We've saved your professional details. Please review and continue."
            : "Please provide your professional information to complete your profile"
        }
      />

      {isReviewMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Your Professional Details
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                We&apos;ve saved your information from your previous session.
                You can review the details below and continue to the next step.
              </p>
            </div>
          </div>
        </div>
      )}

      <ProfessionalDetailsForm
        form={form}
        isReviewMode={isReviewMode}
        selectOptionFallbacks={selectOptionFallbacks}
      />

      <StepNavigation
        onBack={onBack}
        onNext={form.handleSubmit(onSubmit)}
        backLabel="Back to Login"
        nextLabel={isReviewMode ? "Continue to Survey" : "Continue to Survey"}
        isLoading={isLoading}
      />
    </div>
  );
}
