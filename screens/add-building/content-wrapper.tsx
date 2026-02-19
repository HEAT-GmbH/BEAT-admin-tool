"use client";

import { Loader } from "@/components/loader";
import { useAddBuilding } from "./context";
import { PropsWithChildren } from "react";

export const ContentWrapper = ({ children }: PropsWithChildren) => {
  const { isPending } = useAddBuilding();

  if (isPending) {
    return (
      <div className="size-full min-h-70 grid place-items-center">
        <Loader size={44} />
      </div>
    );
  }

  return <div className="flex-1 w-full">{children}</div>;
};
