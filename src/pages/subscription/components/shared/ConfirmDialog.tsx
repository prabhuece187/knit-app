import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import type { ConfirmDialogProps } from "../../types";

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md mx-4 p-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle
              className={`text-lg font-semibold ${getVariantStyles()}`}
            >
              {title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">{description}</p>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                variant={getButtonVariant()}
                onClick={onConfirm}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
