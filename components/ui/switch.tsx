"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "data-checked:bg-(--blue--500) hover:data-checked:bg-(--blue--700)",
        "data-unchecked:bg-(--bg--soft-200) hover:data-unchecked:bg-(--bg--soft-300)",
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20",
        "aria-invalid:border-destructive shrink-0 rounded-full border border-transparent focus-visible:ring-3",
        "aria-invalid:ring-3 data-[size=default]:h-4 data-[size=default]:w-7 data-[size=sm]:h-3.5",
        "data-[size=sm]:w-6 peer group/switch relative inline-flex items-center transition-all outline-none after:absolute",
        "after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white rounded-full group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2.5",
          "group-data-[size=default]/switch:data-checked:translate-x-3.5",
          "group-data-[size=sm]/switch:data-checked:translate-x-3.5",
          "group-data-[size=default]/switch:data-unchecked:translate-x-0.25 group-data-[size=sm]/switch:data-unchecked:translate-x-0.25",
          "pointer-events-none block ring-0 transition-transform",
          "shrink-0 flex items-center justify-center",
        )}
      >
        <div
          className={cn(
            "size-1 rounded-full",
            "group-data-checked/switch:bg-(--blue--500) group-data-checked/switch:hover:bg-(--blue--700)",
            "group-data-unchecked/switch:bg-(--bg--soft-200) group-data-unchecked/switch:hover:bg-(--bg--soft-300)",
          )}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
