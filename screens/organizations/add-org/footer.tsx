"use client";

import { Button } from "@/components/ui/button";
import { useSteps, steps } from "./steps.context";
import { useFormContext } from "react-hook-form";
import { AddOrgData } from "../schema";
import { useOrgContext } from "../context";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

export const Footer = ({ onCancel, onSuccess }: Props) => {
  const { step, onNext } = useSteps();
  const { trigger, handleSubmit } = useFormContext<AddOrgData>();
  const { createOrganisation, isCreating } = useOrgContext();

  const isLastStep = step === steps.length - 1;

  const handleNext = async () => {
    const isValid = await trigger(step === 0 ? "details" : "invites");
    if (isValid) {
      onNext();
    }
  };

  const handleCreate = handleSubmit(async (data) => {
    const { details, invites } = data;
    await createOrganisation({
      name: details.name,
      industry: details.industry,
      country_id: details.country || undefined,
      city_id: details.city || undefined,
      invite_users: (invites ?? [])
        .filter((i) => i.email && i.role)
        .map((i) => ({ email: i.email!, role: i.role! })),
    });
    onSuccess();
  });

  return (
    <div className="p-5 border-t border-border flex items-center justify-end gap-4 w-full mt-auto bg-white">
      <Button
        type="button"
        variant="ghost"
        className="text-(--text--sub-600)"
        onClick={onCancel}
        disabled={isCreating}
      >
        Cancel
      </Button>

      <Button
        type="button"
        onClick={!isLastStep ? handleNext : handleCreate}
        disabled={isCreating}
      >
        {isCreating
          ? "Creating..."
          : !isLastStep
          ? "Continue"
          : "Create organization"}
      </Button>
    </div>
  );
};
