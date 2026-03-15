"use client";

import { PropsWithChildren } from "react";
import { RightDialogHeader } from "@/components/right-dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: () => void;
  nextLabel?: string;
  isLoading?: boolean;
}

export const SSDialog = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  onSubmit,
  nextLabel = "Done",
  isLoading = false,
}: PropsWithChildren<Props>) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="right-side-dialog gap-0 p-0 max-w-136!">
        <RightDialogHeader
          title={title}
          description={description}
          onClose={() => onOpenChange(false)}
          className="border-b border-(--stroke--soft-200)"
        />
        {children}
        <div className="p-4 border-t border-(--stroke--soft-200) flex justify-end gap-3 bg-white mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 text-(--text--main-900)"
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading} className="h-10 px-4">
            {nextLabel}
            <Icon name="arrow-right-s-line" size={20} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
