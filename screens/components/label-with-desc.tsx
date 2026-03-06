import { Label } from "@/components/ui/label";

export const LabelWithDesc = ({
  label,
  description,
  className,
}: {
  label: string;
  description: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Label className="text-base/6 font-bold text-foreground">{label}</Label>
      <p className="text-sm/6 text-(--text--sub-600)">{description}</p>
    </div>
  );
};
