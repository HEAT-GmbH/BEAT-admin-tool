"use client";

import { RightDialogHeader } from "@/components/right-dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
  footer: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BuildingStructuralDialog = ({
  title,
  open,
  onOpenChange,
  children,
  footer,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="right-side-dialog gap-0"
        showCloseButton={false}
      >
        <RightDialogHeader title={title} onClose={() => onOpenChange(false)} />
        <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-4 hide-scrollbar">
          {children}
        </div>
        <div className="p-5 border-t border-border flex gap-4 items-center justify-between w-full mt-auto bg-white">
          {footer}
        </div>
      </DialogContent>
    </Dialog>
  );
};
