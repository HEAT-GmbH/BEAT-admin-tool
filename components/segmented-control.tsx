"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useEffectEvent, useState } from "react";

interface Props<T extends string> {
  value: T;
  onValueChange: (val: T) => void;
  items: { value: T; label: ReactNode }[];
}

export const SegmentedControl = <T extends string>({
  value,
  onValueChange,
  items,
}: Props<T>) => {
  const [selected, setSelected] = useState<T>(value);

  const syncControlled = useEffectEvent(() => {
    if (value !== selected) {
      setSelected(value);
    }
  });
  useEffect(() => {
    syncControlled();
  }, [value]);

  return (
    <div className="flex items-stretch gap-0.25 bg-border border border-border rad-1.5 shadow-xs flex-nowrap overflow-hidden">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn(
            "py-2 px-2.5 hover:bg-accent/10 bg-white transition-colors duration-300",
            "text-foreground text-xs/4.5 font-medium flex items-center gap-2",
            selected === item.value && "bg-primary text-primary-foreground",
          )}
          onClick={() => {
            setSelected(item.value);
            onValueChange(item.value);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
