"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { Button } from "./ui/button";

interface Props {
  title: string;
  description?: string;
  onClose: () => void;
  className?: string;
}

export const RightDialogHeader = ({
  title,
  description,
  onClose,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "w-full p-5 flex items-start justify-between gap-2",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="label-large">{title}</h2>
        {!!description && (
          <p className="paragraph-small text-(--text--sub-600)">
            {description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        className="size-6 p-auto shrink-0"
        onClick={onClose}
      >
        <Icon name="close-line" size={20} />
      </Button>
    </div>
  );
};
