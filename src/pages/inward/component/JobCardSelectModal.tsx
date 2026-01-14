"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectPopover } from "@/components/custom/CustomPopover";

import { useEffect, useState } from "react";
import { useGetJobListQuery } from "@/api/JobMasterApi";
import { usePostlinkJobCardMutation } from "@/api/InwardApi";

import type { JobMaster } from "@/schema-types/master-schema";

export interface LinkJobCardResponse {
  message: string;
  data: {
    id: number;
    job_card_id: number;
  };
}

interface JobCardSelectModalProps {
  open: boolean;
  inwardDetailId: number; // ✅ REQUIRED
  defaultValue?: number;
  onClose: () => void;
  onSuccess?: (jobCardId: number) => void;
}

export function JobCardSelectModal({
  open,
  inwardDetailId,
  defaultValue,
  onClose,
  onSuccess,
}: JobCardSelectModalProps) {
  const { data: jobCards = [] } = useGetJobListQuery("") as {
    data: JobMaster[];
  };

  const [postlinkJobCard, { isLoading }] = usePostlinkJobCardMutation();

  const [jobCardId, setJobCardId] = useState<number | undefined>(defaultValue);

  // keep default value in sync
  useEffect(() => {
    setJobCardId(defaultValue);
  }, [defaultValue]);

  const handleSave = async () => {
    if (!jobCardId) return;

    try {
      await postlinkJobCard({
        inwardDetailId,
        job_card_id: jobCardId,
      }).unwrap();

      onSuccess?.(jobCardId);
      onClose();
    } catch (err) {
      console.error("Failed to link job card", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Job Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectPopover
            placeholder="Select Job Card..."
            options={jobCards}
            valueKey="id"
            labelKey="job_card_no"
            label=""
            value={jobCardId}
            onValueChange={(v) => setJobCardId(Number(v))}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={!jobCardId || isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
