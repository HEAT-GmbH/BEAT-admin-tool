"use client";
import { Dialog, DialogContent } from "./ui/dialog";

interface Props {
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
}

export const EpdLibraryDialog = ({ isOpen, onOpenChange }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="right-side-dialog"
      ></DialogContent>
    </Dialog>
  );
};
