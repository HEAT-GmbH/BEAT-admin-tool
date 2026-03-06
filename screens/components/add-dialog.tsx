"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropsWithChildren } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: () => void;
  nextLabel?: string;
}

export const AddSSDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  children,
  nextLabel = "Done",
}: PropsWithChildren<Props>) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="right-side-dialog gap-0 p-0 max-w-136!">
        <div className="flex items-start justify-between gap-4 p-5">
          <Button
            variant="outline"
            className="flex items-center justify-center shrink-0 border border-border size-12 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <Icon
              name="arrow-left"
              size={24}
              color="var(--icon--sub-600)"
            />{" "}
          </Button>
          <div className="flex-1 space-y-1">
            <h2 className="label-large font-medium text-foreground">{title}</h2>
            <p className="paragraph-small text-(--text--sub-600)">
              {description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <Icon name="close-line" size={24} color="var(--icon--sub-600)" />
          </Button>
        </div>
        <div className="w-full overflow-y-auto flex-1 hide-scrollbar p-5 pt-3.25">
          {children}
        </div>
        <div className="p-4 border-t border-(--stroke--soft-200) flex justify-end gap-3 bg-white mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 text-(--text--main-900)"
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} className="h-10 px-4">
            {nextLabel}
            <Icon name="arrow-right-s-line" size={20} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
