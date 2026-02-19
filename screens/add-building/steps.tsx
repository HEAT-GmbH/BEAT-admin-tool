"use client";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAddBuilding } from "./context";
import { STEPS } from "./step-lists";

export const AddBuildingSteps = () => {
  const { activeMainStep, activeSubStep, completed, startTransition } =
    useAddBuilding();

  return (
    <div className="flex flex-col gap-0.5 w-full">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-stretch gap-2.25">
          <div className="flex flex-col items-center gap-1">
            {completed[`${step.id}`] ? (
              <Icon name="check-fill" size={18} />
            ) : (
              <div
                className={cn(
                  "rounded-full border size-4.5",
                  activeMainStep?.id === step.id
                    ? "border-(--stroke--strong-950)"
                    : "border-(--bg--sub-300)",
                )}
              />
            )}
            <div
              className="flex-1 w-px"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, var(--stroke--sub-300) 0, var(--stroke--sub-300) 4px, transparent 4px, transparent 8px)",
              }}
            />
          </div>
          <div>
            <Link
              href={`/add-building${step.steps?.length ? step.path + step.steps[0].path : step.path}`}
              onClick={() => startTransition(() => {})}
              className={cn(
                !step.steps && index !== STEPS.length - 1 && "pb-5.25",
              )}
            >
              <p
                className={cn(
                  "text-base/4.5 text-(--text--sub-600)",
                  activeMainStep?.id === step.id &&
                    "text-(--stroke--strong-950)",
                  index !== STEPS.length - 1 && "mb-4",
                )}
              >
                {step.label}
              </p>
            </Link>
            <div className="flex flex-col gap-2.5">
              {step.steps?.map((subStep, index) => (
                <Link
                  key={subStep.id}
                  href={`/add-building${step.path + subStep.path}`}
                  onClick={() => startTransition(() => {})}
                  className={cn(index === step.steps!.length - 1 && "pb-5.25")}
                >
                  <div className="px-1 py-1.5 flex items-center gap-1">
                    {!!completed[`${step.id}-${subStep.id}`] && (
                      <Icon name="check-fill" size={12} />
                    )}
                    <p
                      className={cn(
                        "text-xs/3.5 text-(--text--sub-600)",
                        activeSubStep?.id === subStep.id &&
                          "text-(--stroke--strong-950)",
                      )}
                    >
                      {subStep.label}
                    </p>
                    <Icon
                      name="arrow-right-up-line"
                      size={12}
                      color="var(--icon--sub-600)"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
