"use client";
import { Progress } from "@/components/progress";
import { useAddBuilding } from "./context";

export const AddBuildingProgress = () => {
  const { completed } = useAddBuilding();
  const percentage =
    (Object.values(completed).filter(Boolean).length /
      Object.keys(completed).length) *
    100;

  return (
    <div className="space-y-1.5 w-full">
      <span className="label-x-small text-(--text--sub-600) font-medium">
        {percentage}% completed
      </span>
      <Progress value={percentage} barClassName="bg-primary" />
    </div>
  );
};
