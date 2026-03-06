import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  status: "Active" | "Inactive";
  onStatusChange: (status: "Active" | "Inactive") => void;
}

export const ViewItemHeader = ({
  icon,
  title,
  status,
  onStatusChange,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2.5 bg-muted rounded-[0.5rem] border border-border">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="label-small font-medium">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <Label
          htmlFor="status"
          className="text-sm font-medium text-(--text--strong-950)"
        >
          {status}
        </Label>
        <Switch
          id="status"
          checked={status === "Active"}
          onCheckedChange={(v) => onStatusChange(v ? "Active" : "Inactive")}
        />
      </div>
    </div>
  );
};
