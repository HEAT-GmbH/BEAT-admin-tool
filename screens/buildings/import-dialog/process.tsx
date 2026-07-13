"use client";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useSteps } from "./steps.context";

export const Process = () => {
  const { buildingUuid, onSuccess } = useSteps();

  return (
    <div className="size-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md text-center animate-in fade-in zoom-in duration-500">
        <div className="rounded-full size-23 bg-(--state--success--lighter) shrink-0 grid place-items-center">
          <Icon
            name="check-double-line"
            size={62}
            className="text-(--state--success--base)"
          />
        </div>
        <div className="space-y-2">
          <h6 className="h6-title text-foreground font-bold">Import complete!</h6>
          <p className="paragraph-small text-(--text--sub-600) text-center">
            Building has been successfully added to your database.
          </p>
          {buildingUuid && (
            <p className="paragraph-x-small text-(--text--sub-600) break-all">
              UUID: {buildingUuid}
            </p>
          )}
        </div>
        <Button onClick={onSuccess}>Go to buildings</Button>
      </div>
    </div>
  );
};
