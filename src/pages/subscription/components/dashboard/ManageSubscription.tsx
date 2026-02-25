import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, AlertCircle } from "lucide-react";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import type { SubscriptionResponse } from "../../types";

interface ManageSubscriptionProps {
  subscription: SubscriptionResponse;
  onPause: (pauseAt: "now" | "cycle") => Promise<void>;
  onResume: (resumeAt: "now" | "cycle") => Promise<void>;
  onCancel: (cancelAtEnd: boolean) => Promise<void>;
  isProcessing: boolean;
}

export const ManageSubscription: React.FC<ManageSubscriptionProps> = ({
  subscription,
  onPause,
  onResume,
  onCancel,
  isProcessing,
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [actionType, setActionType] = useState<"now" | "cycle" | boolean>(
    "now"
  );

  const handlePause = (pauseAt: "now" | "cycle") => {
    setActionType(pauseAt);
    setShowPauseDialog(true);
  };

  const handleResume = (resumeAt: "now" | "cycle") => {
    setActionType(resumeAt);
    setShowResumeDialog(true);
  };

  const handleCancel = (cancelAtEnd: boolean) => {
    setActionType(cancelAtEnd);
    setShowCancelDialog(true);
  };

  return (
    <>
      <Card className="py-5">
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5">
          {subscription.status === "active" && (
            <>
              <Button
                className="w-full justify-start text-yellow-600 hover:text-yellow-700"
                variant="outline"
                onClick={() => handlePause("now")}
                disabled={isProcessing}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pause Now
              </Button>
              <Button
                className="w-full justify-start text-yellow-600 hover:text-yellow-700"
                variant="outline"
                onClick={() => handlePause("cycle")}
                disabled={isProcessing}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pause at Cycle End
              </Button>
            </>
          )}

          {subscription.status === "paused" && (
            <>
              <Button
                className="w-full justify-start text-green-600 hover:text-green-700"
                variant="outline"
                onClick={() => handleResume("now")}
                disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resume Now
              </Button>
              <Button
                className="w-full justify-start text-green-600 hover:text-green-700"
                variant="outline"
                onClick={() => handleResume("cycle")}
                disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resume at Cycle End
              </Button>
            </>
          )}

          <Button
            className="w-full justify-start text-red-600 hover:text-red-700"
            variant="outline"
            onClick={() => handleCancel(true)}
            disabled={isProcessing}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Cancel at Cycle End
          </Button>
          <Button
            className="w-full justify-start text-red-600 hover:text-red-700"
            variant="outline"
            onClick={() => handleCancel(false)}
            disabled={isProcessing}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Cancel Immediately
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showPauseDialog}
        title="Confirm Pause"
        description={`Your subscription will be paused ${
          actionType === "now"
            ? "immediately"
            : "at the end of your billing cycle"
        }. You can resume it anytime.`}
        confirmText="Yes, Pause"
        variant="warning"
        onConfirm={async () => {
          await onPause(actionType as "now" | "cycle");
          setShowPauseDialog(false);
        }}
        onCancel={() => setShowPauseDialog(false)}
        isLoading={isProcessing}
      />

      <ConfirmDialog
        isOpen={showResumeDialog}
        title="Confirm Resume"
        description={`Your subscription will be resumed ${
          actionType === "now"
            ? "immediately"
            : "at the end of your billing cycle"
        }. Billing will continue as per your plan.`}
        confirmText="Yes, Resume"
        variant="default"
        onConfirm={async () => {
          await onResume(actionType as "now" | "cycle");
          setShowResumeDialog(false);
        }}
        onCancel={() => setShowResumeDialog(false)}
        isLoading={isProcessing}
      />

      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Confirm Cancellation"
        description={`This action cannot be undone. Your subscription will be cancelled ${
          actionType === true
            ? "at the end of your billing cycle"
            : "immediately with no refund"
        }.`}
        confirmText="Yes, Cancel"
        variant="destructive"
        onConfirm={async () => {
          await onCancel(actionType as boolean);
          setShowCancelDialog(false);
        }}
        onCancel={() => setShowCancelDialog(false)}
        isLoading={isProcessing}
      />
    </>
  );
};
