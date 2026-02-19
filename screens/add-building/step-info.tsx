"use client";

import { Icon } from "@/components/icon";
import { useAddBuilding } from "./context";
import { cn } from "@/lib/utils";

export const StepInfo = () => {
  const { stepBadge, title, description, tip, isPending } = useAddBuilding();

  if (isPending) return null;

  return (
    <>
      {!!stepBadge && (
        <span className="bg-(--bg--weak-50) text-foreground p-2.5 rounded-full text-xs font-semibold mb-4 inline-flex gap-0.75">
          {stepBadge.current} out of{" "}
          <span className="text-(--text--sub-600) font-normal">
            {stepBadge.total} steps
          </span>
        </span>
      )}
      <h5 className="text-base font-extrabold text-foreground mb-1">{title}</h5>
      <p className={cn("text-sm text-(--text--sub-600) mb-3", !tip && "mb-6")}>
        {description}
      </p>
      {!!tip && (
        <div className="flex items-start gap-2 p-2 rounded-[0.5rem] bg-(--state--faded--lighter) text-foreground mb-4">
          <Icon
            name="information-2-line"
            color="var(--icon--strong-950)"
            size={24}
          />
          <p>{tip}</p>
        </div>
      )}
    </>
  );
};
