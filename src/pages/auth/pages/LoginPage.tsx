import { useAuthFlow } from "../hooks/useAuthFlow";
import AuthBaseLayout from "../components/layouts/AuthBaseLayout";
import AuthStepContainer from "../components/layouts/AuthStepContainer";
import EmailStep from "../components/steps/EmailStep";
import OtpStep from "../components/steps/OtpStep";
import RegistrationPage from "./RegistrationPage";
import { AUTH_STEPS } from "../utils/authConstants";

export default function LoginPage() {
  const {
    currentStep,
    userEmail,
    isRequestingOtp,
    isValidatingOtp,
    handleEmailSubmit,
    handleOtpSubmit,
    handleResendOtp,
    handleBackToEmail,
    setCurrentStep,
  } = useAuthFlow();

  // Show registration flow if needed
  if (currentStep === AUTH_STEPS.REGISTRATION) {
    return (
      <RegistrationPage
        email={userEmail}
        onBackToLogin={() => setCurrentStep(AUTH_STEPS.EMAIL)}
      />
    );
  }

  return (
    <AuthBaseLayout>
      <AuthStepContainer
        footer={
          <p>
            {currentStep === AUTH_STEPS.EMAIL
              ? "Secure login with email verification"
              : "Need help? Contact support"}
          </p>
        }
      >
        {currentStep === AUTH_STEPS.EMAIL && (
          <EmailStep onSubmit={handleEmailSubmit} isLoading={isRequestingOtp} />
        )}

        {currentStep === AUTH_STEPS.OTP && (
          <OtpStep
            email={userEmail}
            onSubmit={handleOtpSubmit}
            onResend={handleResendOtp}
            onBack={handleBackToEmail}
            isLoading={isValidatingOtp}
            isResending={isRequestingOtp}
          />
        )}
      </AuthStepContainer>
    </AuthBaseLayout>
  );
}
