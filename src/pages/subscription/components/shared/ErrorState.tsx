import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          {onRetry && <Button onClick={onRetry}>Try Again</Button>}
        </CardContent>
      </Card>
    </div>
  );
};
