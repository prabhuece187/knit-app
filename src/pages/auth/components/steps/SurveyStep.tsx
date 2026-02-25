import { FileText } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import AuthHeader from "../shared/AuthHeader";
import SurveyForm from "../forms/SurveyForm";
import StepNavigation from "../shared/StepNavigation";
import type { Step2Registration } from "../../types/registration.types";

interface SurveyStepProps {
  form: UseFormReturn<Step2Registration>;
  onSubmit: (data: Step2Registration) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function SurveyStep({
  form,
  onSubmit,
  onBack,
  isLoading,
}: SurveyStepProps) {
  return (
    <div className="space-y-6">
      <AuthHeader
        icon={FileText}
        title="Language & Survey"
        description="Tell us about your language preference and how you found us"
        iconClassName="text-green-600"
      />

      <SurveyForm form={form} />

      <StepNavigation
        onBack={onBack}
        onNext={form.handleSubmit(onSubmit)}
        backLabel="Back to Professional Details"
        nextLabel="Complete Registration"
        isLoading={isLoading}
      />
    </div>
  );
}
