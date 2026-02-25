"use client";

import { RightDialogHeader } from "@/components/right-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropsWithChildren } from "react";
import { useOperationalDataEntryContext } from "./operational-data-entry.context";
import { Pagination } from "./pagination";

interface Props extends PropsWithChildren {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export const OperationalDataEntryDialog = ({
  title,
  open,
  onOpenChange,
  onSave,
  onCancel,
  children,
}: Props) => {
  const { selectedItems } = useOperationalDataEntryContext();
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
        <RightDialogHeader title={title} onClose={() => onOpenChange(false)} />
        <div className="flex-1 overflow-y-auto p-5 pt-0 hide-scrollbar">
          {children}
        </div>
        <div className="p-5 border-t border-border flex gap-4 items-center justify-between w-full mt-auto bg-white">
          <div className="flex-1">
            <Pagination />
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-fit text-(--text--sub-600)"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="w-fit"
              onClick={(e) => {
                e.preventDefault();
                onSave();
              }}
              disabled={selectedItems.length === 0}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
