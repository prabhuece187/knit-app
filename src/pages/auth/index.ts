// Main Pages
export { default as LoginPage } from "./pages/LoginPage";
export { default as RegistrationPage } from "./pages/RegistrationPage";

// Hooks
export { useAuthFlow } from "./hooks/useAuthFlow";
export { useRegistrationFlow } from "./hooks/useRegistrationFlow";
export { useAuthNavigation } from "./hooks/useAuthNavigation";
export { useAuthError } from "./hooks/useAuthError";
export { useOtpTimer } from "./hooks/useOtpTimer";

// Components - Steps
export { default as EmailStep } from "./components/steps/EmailStep";
export { default as OtpStep } from "./components/steps/OtpStep";
export { default as ProfessionalStep } from "./components/steps/ProfessionalStep";
export { default as SurveyStep } from "./components/steps/SurveyStep";
export { default as CompletionStep } from "./components/steps/CompletionStep";

// Components - Forms
export { default as EmailForm } from "./components/forms/EmailForm";
export { default as OtpForm } from "./components/forms/OtpForm";
export { default as ProfessionalDetailsForm } from "./components/forms/ProfessionalDetailsForm";
export { default as SurveyForm } from "./components/forms/SurveyForm";

// Components - Shared
export { default as AuthCard } from "./components/shared/AuthCard";
export { default as AuthHeader } from "./components/shared/AuthHeader";
export { default as StepIndicator } from "./components/shared/StepIndicator";
export { default as StepNavigation } from "./components/shared/StepNavigation";
export { default as ErrorAlert } from "./components/shared/ErrorAlert";
export { default as LoadingState } from "./components/shared/LoadingState";

// Components - Layouts
export { default as AuthBaseLayout } from "./components/layouts/AuthBaseLayout";
export { default as AuthStepContainer } from "./components/layouts/AuthStepContainer";

// Types
// export * from "./types/auth.types";
export * from "./types/login.types";
export * from "./types/registration.types";

// Utils
export * from "./utils/authConstants";
export * from "./utils/authErrors";
export * from "./utils/authValidation";
