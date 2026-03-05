"use client";

import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormContent } from "./form";
import { AddCountryData, addCountrySchema } from "./schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCountryDialog = ({ open, onOpenChange }: Props) => {
  const { reset, handleSubmit, ...methods } = useForm<AddCountryData>({
    resolver: zodResolver(addCountrySchema),
    defaultValues: {
      country: "",
      cities: [],
    },
  });

  const onSubmit = (data: AddCountryData) => {
    console.log("Submit country:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add country & cities"
      description="Create and add country you want to add."
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider handleSubmit={handleSubmit} reset={reset} {...methods}>
        <form className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <FormContent />
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
