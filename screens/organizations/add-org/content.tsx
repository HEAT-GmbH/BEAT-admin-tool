"use client";

import { useSteps } from "./steps.context";
import { DetailsStep } from "./details-step";
import { InviteStep } from "./invite-step";

export const Content = () => {
  const { step } = useSteps();

  return (
    <div className="flex-1 overflow-y-auto px-5 hide-scrollbar">
      {step === 0 && <DetailsStep />}
      {step === 1 && <InviteStep />}
    </div>
  );
};
