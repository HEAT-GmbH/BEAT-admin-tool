import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export const PageHeader = ({
  children,
  className,
  title,
  description,
}: PropsWithChildren<{
  className?: string;
  title: string;
  description?: string;
}>) => {
  return (
    <div
      className={cn(
        "flex items-center w-full gap-3 justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        {!!description && (
          <p className="text-sm/4.5 text-(--text--sub-600)">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};
