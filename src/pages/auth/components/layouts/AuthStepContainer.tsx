import AuthCard from "../shared/AuthCard";

interface AuthStepContainerProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthStepContainer({
  children,
  footer,
}: AuthStepContainerProps) {
  return (
    <>
      <AuthCard>{children}</AuthCard>

      {footer && (
        <div className="text-center mt-6 text-sm text-gray-600">{footer}</div>
      )}
    </>
  );
}
