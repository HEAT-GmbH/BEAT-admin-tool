"use client";

import { Loader } from "@/components/loader";
import { useEditBuilding } from "./context";
import { PropsWithChildren } from "react";

export const EditContentWrapper = ({ children }: PropsWithChildren) => {
  const { isPending } = useEditBuilding();

  if (isPending) {
    return (
      <div className="size-full min-h-70 grid place-items-center">
        <Loader size={44} />
      </div>
    );
  }

  return <div className="flex-1 w-full">{children}</div>;
};
