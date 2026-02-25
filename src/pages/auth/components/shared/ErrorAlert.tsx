import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  canRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorAlert({
  message,
  onDismiss,
  canRetry = false,
  onRetry,
  className,
}: ErrorAlertProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive" className={cn("relative", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1">{message}</span>
        <div className="flex items-center gap-2 ml-2">
          {canRetry && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-auto p-1 hover:bg-red-100"
            >
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-auto p-1 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
