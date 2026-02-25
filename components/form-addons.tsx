import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const FormEndLabel = ({ label }: { label: string }) => {
  return (
    <span className="paragraph-small align-middle font-normal text-[var(--text--sub-600)]">
      {label}
    </span>
  );
};

export const FormEndSelect = ({
  options,
  placeholder,
  className,
}: {
  options: { label: React.ReactNode; value: string }[];
  placeholder?: string;
  className?: string;
}) => {
  return (
    <Select defaultValue={options[0]?.value}>
      <SelectTrigger
        className={cn("w-fit border-none h-full", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue placeholder={placeholder}>
          {(value: string) =>
            options.find((option) => option.value === value)?.label
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-fit min-w-none">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
