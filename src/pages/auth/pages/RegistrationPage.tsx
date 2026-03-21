import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { User, FileText, CheckCircle } from "lucide-react";
import { useRegistrationFlow } from "../hooks/useRegistrationFlow";
import AuthBaseLayout from "../components/layouts/AuthBaseLayout";
import AuthStepContainer from "../components/layouts/AuthStepContainer";
import StepIndicator from "../components/shared/StepIndicator";
import ProfessionalStep from "../components/steps/ProfessionalStep";
import SurveyStep from "../components/steps/SurveyStep";
import CompletionStep from "../components/steps/CompletionStep";
import { REGISTRATION_STEPS } from "../utils/authConstants";
import {
  step1RegistrationSchema,
  step2RegistrationSchema,
  type Step1Registration,
  type Step2Registration,
} from "../types/registration.types";

interface RegistrationPageProps {
  email: string;
  onBackToLogin: () => void;
}

export default function RegistrationPage({
  email,
  onBackToLogin,
}: RegistrationPageProps) {
  const navigate = useNavigate();

  // Forms
  const professionalForm = useForm<Step1Registration>({
    resolver: zodResolver(step1RegistrationSchema),
  });

  const surveyForm = useForm<Step2Registration>({
    resolver: zodResolver(step2RegistrationSchema),
  });

  // Registration flow
  const {
    currentStep,
    isReviewMode,
    isSubmittingProfessional,
    isSubmittingSurvey,
    handleProfessionalSubmit,
    handleSurveySubmit,
    handleReviewAndContinue,
    handleBackToProfessional,
    professionalSelectFallbacks,
  } = useRegistrationFlow({
    email,
    onComplete: () => navigate("/dashboard"),
    professionalForm,
  });

  // Define steps for indicator
  const steps = [
    {
      id: REGISTRATION_STEPS.PROFESSIONAL,
      label: "Professional",
      icon: User,
    },
    {
      id: REGISTRATION_STEPS.SURVEY,
      label: "Survey",
      icon: FileText,
    },
    {
      id: REGISTRATION_STEPS.COMPLETE,
      label: "Complete",
      icon: CheckCircle,
    },
  ];

  // Get completed steps
  const completedSteps: string[] = [];
  if (currentStep === REGISTRATION_STEPS.SURVEY) {
    completedSteps.push(REGISTRATION_STEPS.PROFESSIONAL);
  } else if (currentStep === REGISTRATION_STEPS.COMPLETE) {
    completedSteps.push(
      REGISTRATION_STEPS.PROFESSIONAL,
      REGISTRATION_STEPS.SURVEY
    );
  }

  return (
    <AuthBaseLayout>
      <AuthStepContainer>
        {/* Progress Indicator */}
        <StepIndicator
          steps={steps}
          currentStepId={currentStep}
          completedStepIds={completedSteps}
        />

        {/* Step Content */}
        {currentStep === REGISTRATION_STEPS.PROFESSIONAL && (
          <ProfessionalStep
            form={professionalForm}
            selectOptionFallbacks={professionalSelectFallbacks}
            onSubmit={
              isReviewMode ? handleReviewAndContinue : handleProfessionalSubmit
            }
            onBack={onBackToLogin}
            isLoading={isSubmittingProfessional}
            isReviewMode={isReviewMode}
          />
        )}

        {currentStep === REGISTRATION_STEPS.SURVEY && (
          <SurveyStep
            form={surveyForm}
            onSubmit={handleSurveySubmit}
            onBack={handleBackToProfessional}
            isLoading={isSubmittingSurvey}
          />
        )}

        {currentStep === REGISTRATION_STEPS.COMPLETE && (
          <CompletionStep onComplete={() => navigate("/dashboard")} />
        )}
      </AuthStepContainer>
    </AuthBaseLayout>
  );
}
