"use client";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSteps } from "./steps.context";

export const Process = () => {
  const { toggleComplete, item, isCompleted, buildingUuid, onSuccess } =
    useSteps();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isCompleted(item.id)) {
      setStatus("success");
      return;
    }

    const run = async () => {
      if (!buildingUuid) {
        setStatus("error");
        setErrorMessage("Missing building UUID. Please restart the import.");
        return;
      }

      setStatus("loading");
      try {
        const res = await fetch("/api/buildings/import/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ building_uuid: buildingUuid }),
        });

        if (res.ok) {
          toggleComplete(item.id, true);
          setStatus("success");
        } else {
          const data = await res.json().catch(() => null);
          setStatus("error");
          setErrorMessage(
            data?.detail ?? data?.message ?? `Request failed (${res.status})`,
          );
        }
      } catch (err) {
        console.error("[import/complete]", err);
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="size-full flex flex-col items-center justify-center p-8">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full size-23 bg-(--bg--weak-50) shrink-0 grid place-items-center">
            <Icon
              name="information-fill"
              size={56}
              className="text-(--state--information--base)"
            />
          </div>
          <p className="label-small text-foreground">
            Publishing building…
          </p>
          <p className="paragraph-small text-(--text--sub-600) text-center">
            Please wait while we finalise your import. Do not close this window.
          </p>
        </div>
      )}

      {status === "success" && (
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
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md text-center">
          <div className="rounded-full size-23 bg-(--state--error--lighter) shrink-0 grid place-items-center">
            <Icon
              name="close-circle-fill"
              size={62}
              className="text-(--state--error--base)"
            />
          </div>
          <div className="space-y-2">
            <h6 className="h6-title text-foreground font-bold">
              Publish failed
            </h6>
            {errorMessage && (
              <p className="paragraph-small text-(--state--error--base)">
                {errorMessage}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              setStatus("loading");
              setErrorMessage(null);
              try {
                const res = await fetch("/api/buildings/import/complete", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ building_uuid: buildingUuid }),
                });
                if (res.ok) {
                  toggleComplete(item.id, true);
                  setStatus("success");
                } else {
                  const data = await res.json().catch(() => null);
                  setStatus("error");
                  setErrorMessage(
                    data?.detail ?? data?.message ?? `Status ${res.status}`,
                  );
                }
              } catch {
                setStatus("error");
                setErrorMessage("Network error.");
              }
            }}
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};
