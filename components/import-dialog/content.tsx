"use client";

import { useSteps } from "./steps.context";

export const Content = () => {
  const { item } = useSteps();

  return (
    <div className="flex-1 no-scrollbar overflow-y-auto w-full px-5 py-4">
      <item.component />
    </div>
  );
};
