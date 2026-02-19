"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useAddBuilding } from "./context";

export const AddBuildingFooter = () => {
  const { goBack, skip, next, canSkip, canNext } = useAddBuilding();

  return (
    <div className="px-14 py-6.75 flex items-stretch justify-between border-t border-border">
      <Button
        variant="outline"
        onClick={goBack}
        className="border-(--stroke--strong-950) h-10"
      >
        <Icon name="arrow-left-s-line" /> Back
      </Button>
      <div className="flex items-stretch gap-4 h-10">
        <Button variant="outline" onClick={skip} disabled={!canSkip()}>
          Skip
        </Button>
        <Button onClick={next} disabled={!canNext()}>
          Save & Continue
          <Icon name="arrow-right-s-line" size={20} />
        </Button>
      </div>
    </div>
  );
};
