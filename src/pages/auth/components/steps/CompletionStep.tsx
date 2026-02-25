import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthHeader from "../shared/AuthHeader";

interface CompletionStepProps {
  onComplete: () => void;
}

export default function CompletionStep({ onComplete }: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <AuthHeader
        icon={CheckCircle}
        title="Registration Complete!"
        description="Your professional profile has been created successfully"
        iconClassName="text-green-600"
      />

      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to Professional Directory!
          </h3>
          <p className="text-gray-600">
            You can now access your dashboard and start managing your
            professional profile.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
