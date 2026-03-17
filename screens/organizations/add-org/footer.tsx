"use client";

import { Button } from "@/components/ui/button";
import { useSteps, steps } from "./steps.context";
import { useFormContext } from "react-hook-form";
import { AddOrgData } from "../schema";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

export const Footer = ({ onCancel, onSuccess }: Props) => {
  const { step, onNext, onBack } = useSteps();
  const { trigger, handleSubmit } = useFormContext<AddOrgData>();

  const isLastStep = step === steps.length - 1;

  const handleNext = async () => {
    const isValid = await trigger(step === 0 ? "details" : "invites");
    if (isValid) {
      onNext();
    }
  };

  const handleCreate = handleSubmit((data) => {
    console.log("Creating organization:", data);
    onSuccess();
  });

  return (
    <div className="p-5 border-t border-border flex items-center justify-end gap-4 w-full mt-auto bg-white">
      <Button
        type="button"
        variant="ghost"
        className="text-(--text--sub-600)"
        onClick={onCancel}
      >
        Cancel
      </Button>

      <Button type="button" onClick={!isLastStep ? handleNext : handleCreate}>
        {!isLastStep ? "Continue" : "Create organization"}
      </Button>
    </div>
  );
};
