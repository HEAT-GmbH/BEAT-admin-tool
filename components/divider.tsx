import { cn } from "@/lib/utils";

export const Divider = ({ className }: { className?: string }) => {
  return <div className={cn("w-full h-px bg-border my-0", className)} />;
};
