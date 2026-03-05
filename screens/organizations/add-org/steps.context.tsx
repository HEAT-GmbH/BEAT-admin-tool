"use client";

import { createContext, useContext, useState } from "react";

export const steps = [
  { id: "details", label: "Organization details" },
  { id: "invite", label: "Invite users" },
];

interface StepsContextType {
  step: number;
  setStep: (step: number) => void;
  onNext: () => void;
  onBack: () => void;
  isCompleted: (id: string) => boolean;
  markCompleted: (id: string) => void;
}

const StepsContext = createContext<StepsContextType | null>(null);

export const StepsProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const onNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const onBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const isCompleted = (id: string) => completedSteps.includes(id);

  const markCompleted = (id: string) => {
    if (!completedSteps.includes(id)) {
      setCompletedSteps((prev) => [...prev, id]);
    }
  };

  return (
    <StepsContext.Provider
      value={{
        step,
        setStep,
        onNext,
        onBack,
        isCompleted,
        markCompleted,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error("useSteps must be used within StepsProvider");
  }
  return context;
};
