"use client";

import { Loader } from "@/components/loader";
import { useOperationalDataEntryContext } from "./operational-data-entry.context";
import { SearchControl } from "./search-control";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const OperationalDataEntryForm = () => {
  const {
    isFetching,
    items,
    selectedItems,
    addToSelectedItems,
    removeFromSelectedItems,
  } = useOperationalDataEntryContext();

  const isSelected = (id?: string) =>
    selectedItems.some((item) => item.id === id);

  return (
    <>
      <SearchControl />
      <div className="flex-1">
        {isFetching ? (
          <div className="flex items-center justify-center py-10 flex-1">
            <Loader size={32} />
            <span className="text-xs/4 text-(--text--sub-600) w-[15.625rem]">
              Loading energy carrier. This might take some few seconds
            </span>
          </div>
        ) : (
          <ul className="grid grid-cols-1">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "py-5 flex items-center justify-between gap-2 not-last:border-b border-border",
                  isSelected(item.id) && "bg-muted",
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="label-small text-foreground">
                      {item.subCategory}
                    </span>
                    <div className="flex items-center gap-1 bg-muted p-1 pr-2 rounded-[0.375rem]">
                      <Icon
                        name="pushpin-fill"
                        color="var(--icon--soft-400)"
                        size={16}
                      />
                      <span className="label-x-small text-(--text--sub-600) capitalize">
                        {item.epdType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-stretch gap-1.25">
                    {[
                      item.category,
                      `Unit: ${item.unit}`,
                      `${item.emmissionFactor} kgCO2eq`,
                    ].map((text) => (
                      <span
                        key={text}
                        className="bg-white border border-border px-2 py-1 rounded-[0.375rem] label-x-small text-(--text--sub-600) capitalize"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {isSelected(item.id) ? (
                    <>
                      <div className="grid place-items-center shrink-0 size-8 bg-primary rounded-full">
                        <Icon
                          name="check-line"
                          color="var(--icon--strong-950)"
                          size={20}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => removeFromSelectedItems(item)}
                        className="bg-white text-(--text--sub-600)"
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => addToSelectedItems(item)}
                      className="bg-white text-(--text--sub-600)"
                    >
                      <Icon
                        name="add-large-fill"
                        color="var(--icon--strong-950)"
                        size={20}
                      />
                      Add
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
