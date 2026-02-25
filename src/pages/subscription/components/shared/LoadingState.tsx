import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};
