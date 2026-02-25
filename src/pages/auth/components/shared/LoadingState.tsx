import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingState({
  message = "Loading...",
  fullScreen = false,
  className,
}: LoadingStateProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center gap-3 p-4", className)}
    >
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
