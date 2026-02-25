import { useAuthFlow } from "../hooks/useAuthFlow";
import AuthBaseLayout from "../components/layouts/AuthBaseLayout";
import AuthStepContainer from "../components/layouts/AuthStepContainer";
import EmailStep from "../components/steps/EmailStep";
import OtpStep from "../components/steps/OtpStep";
import { AUTH_STEPS } from "../utils/authConstants";


export default function AdminLoginPage() {

    const {
        currentStep,
        userEmail,
        isRequestingOtp,
        isValidatingOtp,
        handleEmailSubmit,
        handleOtpSubmit,
        handleResendOtp,
        handleBackToEmail,
    } = useAuthFlow("admin");

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
                    <EmailStep onSubmit={handleEmailSubmit} isLoading={isRequestingOtp} role="admin" />
                )}

                {currentStep === AUTH_STEPS.OTP && (
                    <OtpStep
                        email={userEmail}
                        onSubmit={handleOtpSubmit}
                        onResend={handleResendOtp}
                        onBack={handleBackToEmail}
                        isLoading={isValidatingOtp}
                        isResending={isRequestingOtp}
                        role="admin"
                    />
                )}

            </AuthStepContainer>
        </AuthBaseLayout>
    );
}
