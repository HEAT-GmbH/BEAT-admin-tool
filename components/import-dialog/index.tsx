"use client";
import { RightDialogHeader } from "@/components/right-dialog-header";
import { DialogContent } from "@/components/ui/dialog";
import { StepsProvider } from "./steps.context";
import { Control } from "./control";
import { Content } from "./content";
import { Footer } from "./footer";

interface Props {
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
export const ImportDialog = ({ onOpenChange, onSuccess }: Props) => {
  return (
    <DialogContent className="right-side-dialog" showCloseButton={false}>
      <RightDialogHeader
        title="Import building"
        description="Follow our step-by-step wizard to quickly import building data from a CSV file or Excel sheet."
        onClose={() => onOpenChange(false)}
      />
      <StepsProvider onSuccess={onSuccess}>
        <Control />
        <Content />
        <Footer onCancel={() => onOpenChange(false)} />
      </StepsProvider>
    </DialogContent>
  );
};
