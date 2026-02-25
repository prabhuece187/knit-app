import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useCompleteProfessionalDetailsMutation,
  useCompleteSurveyMutation,
  useGetRegistrationStatusQuery,
  useGetSavedProfessionalDetailsQuery,
} from "@/api/authApi";
import { getUserFriendlyError } from "../utils/authErrors";
import {
  REGISTRATION_STEPS,
  SUCCESS_MESSAGES,
  BACKEND_REGISTRATION_STEPS,
} from "../utils/authConstants";
import type { RegistrationStepType } from "../utils/authConstants";
import type {
  Step1Registration,
  Step2Registration,
} from "../types/registration.types";
import type { UseFormReturn } from "react-hook-form";

interface UseRegistrationFlowProps {
  email: string;
  onComplete: () => void;
  professionalForm: UseFormReturn<Step1Registration>;
}

interface UseRegistrationFlowReturn {
  // State
  currentStep: RegistrationStepType;
  isReviewMode: boolean;
  isSubmittingProfessional: boolean;
  isSubmittingSurvey: boolean;
  registrationStatus: unknown;
  savedProfessionalDetails: unknown;

  // Actions
  handleProfessionalSubmit: (data: Step1Registration) => Promise<void>;
  handleSurveySubmit: (data: Step2Registration) => Promise<void>;
  handleReviewAndContinue: () => void;
  handleBackToProfessional: () => void;
  setCurrentStep: (step: RegistrationStepType) => void;
}

export function useRegistrationFlow({
  email,
  // onComplete,
  professionalForm,
}: UseRegistrationFlowProps): UseRegistrationFlowReturn {
  const [currentStep, setCurrentStep] = useState<RegistrationStepType>(
    REGISTRATION_STEPS.PROFESSIONAL
  );
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);

  // API mutations
  const [completeProfessionalDetails, { isLoading: isSubmittingProfessional }] =
    useCompleteProfessionalDetailsMutation();
  const [completeSurvey, { isLoading: isSubmittingSurvey }] =
    useCompleteSurveyMutation();

  // Queries
  const { data: registrationStatus, refetch: refetchStatus } =
    useGetRegistrationStatusQuery({ email });

  const { data: savedProfessionalDetails } =
    useGetSavedProfessionalDetailsQuery(
      { email },
      { skip: currentStep !== REGISTRATION_STEPS.SURVEY || !email }
    );

  /**
   * Check registration status on mount
   */
  useEffect(() => {
    if (registrationStatus) {
      switch (registrationStatus.registrationStep) {
        case BACKEND_REGISTRATION_STEPS.EMAIL_VERIFIED:
          setCurrentStep(REGISTRATION_STEPS.PROFESSIONAL);
          break;
        case BACKEND_REGISTRATION_STEPS.PROFESSIONAL_DETAILS_ADDED:
          setCurrentStep(REGISTRATION_STEPS.SURVEY);
          setIsReviewMode(true);
          break;
        case BACKEND_REGISTRATION_STEPS.REGISTRATION_COMPLETE:
          setCurrentStep(REGISTRATION_STEPS.COMPLETE);
          break;
        default:
          setCurrentStep(REGISTRATION_STEPS.PROFESSIONAL);
      }
    }
  }, [registrationStatus]);

  /**
   * Pre-populate professional form with saved data
   */
  useEffect(() => {
    if (
      savedProfessionalDetails &&
      currentStep === REGISTRATION_STEPS.SURVEY &&
      !hasLoadedSavedData
    ) {
      professionalForm.reset({
        name: savedProfessionalDetails.name,
        mobileNumber: savedProfessionalDetails.mobileNumber,
        whatsappNumber: savedProfessionalDetails.whatsappNumber,
        categoryId: savedProfessionalDetails.category.id,
        subCategoryId: savedProfessionalDetails.subCategory.id,
        profileImage: savedProfessionalDetails.profileImage,
        refererCode: savedProfessionalDetails.refererCode,
      });
      setHasLoadedSavedData(true);
    }
  }, [
    savedProfessionalDetails,
    currentStep,
    hasLoadedSavedData,
    professionalForm,
  ]);

  /**
   * Handle professional details submission
   */
  const handleProfessionalSubmit = async (data: Step1Registration) => {
    try {
      await completeProfessionalDetails({
        data,
        email,
      }).unwrap();

      toast.success(SUCCESS_MESSAGES.PROFESSIONAL_SAVED);
      setCurrentStep(REGISTRATION_STEPS.SURVEY);
      setIsReviewMode(false);
      refetchStatus();
    } catch (err: unknown) {
      const errorMessage = getUserFriendlyError(
        err,
        "Failed to save professional details"
      );
      toast.error(errorMessage);
    }
  };

  /**
   * Handle review and continue
   */
  const handleReviewAndContinue = () => {
    setCurrentStep(REGISTRATION_STEPS.SURVEY);
    setIsReviewMode(false);
  };

  /**
   * Handle survey submission
   */
  const handleSurveySubmit = async (data: Step2Registration) => {
    try {
      await completeSurvey({
        data: {
          mainLanguage: data.language,
          howDidYouKnowAboutUs: data.surveySource,
          referralSource: data.surveySource,
        },
        email,
      }).unwrap();

      toast.success(SUCCESS_MESSAGES.REGISTRATION_COMPLETE);
      setCurrentStep(REGISTRATION_STEPS.COMPLETE);
      refetchStatus();
    } catch (err: unknown) {
      const errorMessage = getUserFriendlyError(
        err,
        "Failed to complete survey"
      );
      toast.error(errorMessage);
    }
  };

  /**
   * Handle back to professional step
   */
  const handleBackToProfessional = () => {
    setCurrentStep(REGISTRATION_STEPS.PROFESSIONAL);
  };

  return {
    // State
    currentStep,
    isReviewMode,
    isSubmittingProfessional,
    isSubmittingSurvey,
    registrationStatus,
    savedProfessionalDetails,

    // Actions
    handleProfessionalSubmit,
    handleSurveySubmit,
    handleReviewAndContinue,
    handleBackToProfessional,
    setCurrentStep,
  };
}
