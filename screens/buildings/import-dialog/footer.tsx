"use client";

import { Button } from "@/components/ui/button";
import { steps, useSteps } from "./steps.context";
import { Icon } from "@/components/icon";
interface Props {
  onCancel: () => void;
}

export const Footer = ({ onCancel }: Props) => {
  const { isCompleted, item, setStep, step } = useSteps();
  const isLastStep = step === steps.length - 1;
  const canGoToNext = isCompleted(item.id) && !isLastStep;

  if (isLastStep && isCompleted(item.id)) return null;

  return (
    <div className="flex items-center justify-end gap-4 border-t border-border p-5">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        onClick={() => setStep((prev) => prev + 1)}
        disabled={!canGoToNext}
      >
        {item.nextLabel ? item.nextLabel : "Continue"}{" "}
        <Icon name="arrow-right-s-line" />
      </Button>
    </div>
  );
};
