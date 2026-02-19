import { cn } from "@/lib/utils";

interface Props {
  value: number;
  className?: string;
  barClassName?: string;
}

export const Progress = ({ value, className, barClassName }: Props) => {
  return (
    <div
      className={cn(
        "w-full h-1.5 bg-(--bg--soft-200) rounded-full overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "h-full bg-(--state--information--base) rounded-full",
          barClassName,
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
