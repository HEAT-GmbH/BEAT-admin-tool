"use client";

import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "./combobox";
import { InputWithIcon } from "../input-with-icon";

type ItemSelect = { value: string; label: string; icon?: ReactNode };

const ITEM_HEIGHT = 36;
const MAX_HEIGHT = 300;

interface VirtualizedComboboxProps {
  options: ItemSelect[];
  value: string;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function VirtualizedCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
}: VirtualizedComboboxProps) {
  const [parent, setParent] = useState<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");

  const filteredOptions = !search
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      );

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parent,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const listHeight = Math.min(filteredOptions.length * ITEM_HEIGHT, MAX_HEIGHT);

  return (
    <Combobox
      items={options}
      value={value}
      onValueChange={onValueChange}
      onInputValueChange={setSearch}
    >
      <ComboboxTrigger className={cn("w-full", className)}>
        <ComboboxValue placeholder={placeholder} />
      </ComboboxTrigger>
      <ComboboxContent>
        <InputWithIcon
          startIcon="search-2-line"
          placeholder={searchPlaceholder}
          groupClassName="w-full h-9 m-0! bg-white! border-border!"
        />
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <div
          ref={setParent}
          className="overflow-auto hide-scrollbar mt-2"
          style={{ height: listHeight }}
        >
          <div
            style={{
              height: getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            {getVirtualItems().map((virtualRow) => {
              const option = filteredOptions[virtualRow.index];

              return (
                <ComboboxItem
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                    "not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground",
                    "gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 relative",
                    "flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none",
                    "data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                  )}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {option.icon}
                  {option.label}
                </ComboboxItem>
              );
            })}
          </div>
        </div>
      </ComboboxContent>
    </Combobox>
  );
}
