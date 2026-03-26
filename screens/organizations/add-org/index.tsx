"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddOrgData, addOrgSchema } from "../schema";
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

export const AddOrgDialog = ({ onOpenChange, onSuccess }: Props) => {
  const methods = useForm<AddOrgData>({
    resolver: zodResolver(addOrgSchema) as any,
    mode: "onTouched",
    defaultValues: {
      details: {
        name: "",
        industry: "",
        country: "",
        city: "",
      },
      invites: [
        { email: "", role: "" },
        { email: "", role: "" },
        { email: "", role: "" },
      ],
    },
  });

  return (
    <DialogContent className="right-side-dialog gap-0" showCloseButton={false}>
      <RightDialogHeader
        title="Add new organization"
        description="Follow our step-by-step wizard to quickly add a new organization"
        onClose={() => onOpenChange(false)}
      />
      <FormProvider {...methods}>
        <StepsProvider>
          <div className="flex flex-col h-full overflow-hidden">
            <Control />
            <Content />
            <Footer
              onCancel={() => onOpenChange(false)}
              onSuccess={() => {
                onSuccess();
                onOpenChange(false);
              }}
            />
          </div>
        </StepsProvider>
      </FormProvider>
    </DialogContent>
  );
};
