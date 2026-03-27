"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  type FC,
} from "react";
import { Upload } from "./upload";
import { MapFields } from "./map-fields";
import { Validate } from "./validate";
import { Preview } from "./preview";
import { Process } from "./process";

export const steps: {
  id: string;
  label: string;
  component: FC;
  nextLabel?: string;
}[] = [
  { id: "upload", label: "Upload", component: Upload },
  { id: "map-fields", label: "Map Fields", component: MapFields },
  {
    id: "validate",
    label: "Validate",
    component: Validate,
    nextLabel: "Process and import",
  },
  {
    id: "preview",
    label: "Preview & Confirm",
    component: Preview,
    nextLabel: "Confirm & Continue",
  },
  { id: "process", label: "Process", component: Process },
];

export interface ImportColumn {
  id: string;
  fileColumn: string;
  requiredHeader: string | null;
  originalRequiredHeader: string | null;
  type: "Text" | "Dropdown" | "Date" | "Year" | "Number";
  status: "mismatch" | "success" | "loading";
  options?: string[];
  sampleValue?: string | number;
}

export interface ValidationResult {
  status: "idle" | "validating" | "success" | "warning" | "error";
  total: number;
  valid: number;
  warnings: number;
  errors: number;
  issues: {
    warnings: string[];
    errors: string[];
  };
}

interface StepsContextType {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  completed: string[];
  toggleComplete: (id: string, value?: boolean) => void;
  isCompleted: (id: string) => boolean;
  item: (typeof steps)[number];
  columns: ImportColumn[];
  setColumns: Dispatch<SetStateAction<ImportColumn[]>>;
  validationResult: ValidationResult | null;
  setValidationResult: Dispatch<SetStateAction<ValidationResult | null>>;
  onSuccess: () => void;
}

const StepsContext = createContext<StepsContextType | null>(null);

export const StepsProvider = ({
  children,
  onSuccess,
}: {
  children: React.ReactNode;
  onSuccess: () => void;
}) => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [columns, setColumns] = useState<ImportColumn[]>([]);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const item = steps[step];

  const toggleComplete = (id: string, value?: boolean) => {
    if (value !== undefined) {
      setCompleted((prev) => {
        const items = prev.filter((i) => i !== id);
        return value ? [...items, id] : items;
      });
      return;
    }
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const isCompleted = (id: string) => completed.includes(id);

  return (
    <StepsContext.Provider
      value={{
        step,
        setStep,
        completed,
        toggleComplete,
        isCompleted,
        item,
        columns,
        setColumns,
        validationResult,
        setValidationResult,
        onSuccess,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error("useSteps must be used within a StepsProvider");
  }
  return context;
};
