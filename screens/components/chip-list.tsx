"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

interface Props {
  list: { id: string; name: string }[];
  onRemove: (index: number) => void;
}

export const ChipList = ({ list, onRemove }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((field, index) => (
        <div
          key={field.id}
          className="flex items-center gap-2 bg-muted px-2 py-1 rounded-[0.375rem]"
        >
          {field.name}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
          >
            <Icon
              name="close-line"
              className="h-5 w-5 text-(--icon--sub-600)"
            />
          </Button>
        </div>
      ))}
    </div>
  );
};
