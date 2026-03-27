"use client";
import { Icon } from "@/components/icon";
import { Progress } from "@/components/progress";
import { Button } from "@/components/ui/button";
import { delay } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { useSteps } from "./steps.context";

export const Process = () => {
  const { toggleComplete, item, isCompleted, onSuccess } = useSteps();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isCompleted(item.id)) {
      setProgress(100);
      return;
    }

    const runImport = async () => {
      for (let i = 0; i <= 100; i += 2) {
        setProgress(i);
        await delay(50); // faster than validation usually, or slower? Let's say ~2.5s
      }
      toggleComplete(item.id, true);
    };

    runImport();
  }, []);

  const isImporting = progress < 100;

  return (
    <div className="size-full flex flex-col items-center justify-center p-8">
      {isImporting ? (
        <div className="w-full max-w-103.5 space-y-0.5 m-auto">
          <div className="flex justify-between items-center gap-2">
            <p className="label-small text-foreground">Importing data</p>
            <span className="paragraph-x-small text-(--text--sub-600)">
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            barClassName="bg-(--state--success--base)"
          />
          <p className="label-small text-(--text--sub-600) text-center mt-3">
            Please wait while we process your file. Do not close this window
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md text-center animate-in fade-in zoom-in duration-500">
          <div className="rounded-full size-23 bg-(--state--success--lighter) shrink-0 grid place-items-center">
            <Icon
              name="check-double-line"
              size={62}
              className="text-(--state--success--base)"
            />
          </div>
          <div className="space-y-2">
            <h6 className="h6-title text-foreground font-bold">
              Import complete!
            </h6>
            <p className="paragraph-small text-(--text--sub-600) text-center">
              Building have been successfully added to your database
            </p>
          </div>
          <Button onClick={onSuccess}>Go to buildings</Button>
        </div>
      )}
    </div>
  );
};
