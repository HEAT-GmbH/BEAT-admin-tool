"use client";

import { RightDialogHeader } from "@/components/right-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function OperationalItemDialog({
  title,
  description,
  open,
  onOpenChange,
  children,
  onSave,
  onCancel,
}: Props) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="right-side-dialog gap-0"
        showCloseButton={false}
      >
        <RightDialogHeader
          title={title}
          description={description}
          onClose={() => onOpenChange(false)}
        />
        <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
          {children}
        </div>
        <div className="p-5 border-t border-border flex gap-4 items-center justify-between w-full mt-auto bg-white">
          <Button
            type="button"
            variant="outline"
            className="flex-1 text-(--text--sub-600)"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              onSave();
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
