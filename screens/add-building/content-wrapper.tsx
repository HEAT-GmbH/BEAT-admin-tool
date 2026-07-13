"use client";

import { Loader } from "@/components/loader";
import { useAddBuilding } from "./context";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export const ContentWrapper = ({ children }: PropsWithChildren) => {
  const { isPending, missingUuid, goBack } = useAddBuilding();

  if (missingUuid) {
    return (
      <div className="size-full min-h-70 flex flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full size-14 bg-(--state--warning--lighter) grid place-items-center">
          <Icon name="error-warning-line" size={28} className="text-(--state--warning--base)" />
        </div>
        <div className="space-y-1">
          <p className="label-small text-foreground font-semibold">No building found</p>
          <p className="paragraph-small text-(--text--sub-600)">
            Please complete step 1 first to create a building before continuing.
          </p>
        </div>
        <Button variant="outline" onClick={goBack}>
          <Icon name="arrow-left-s-line" /> Go back to Step 1
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="size-full min-h-70 grid place-items-center">
        <Loader size={44} />
      </div>
    );
  }

  return <div className="flex-1 w-full">{children}</div>;
};
