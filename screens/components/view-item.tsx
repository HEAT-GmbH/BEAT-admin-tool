import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Popover } from "@base-ui/react";
import { ReactNode } from "react";

interface Props {
  items: ReactNode[];
  switchId: string;
  status: "Active" | "Inactive";
  onStatusChange: (status: "Active" | "Inactive") => void;
  onEdit: () => void;
  onDelete: () => void;
  handle?: Popover.Handle<unknown>;
}

export const ViewItem = ({
  items,
  switchId,
  status,
  onStatusChange,
  onEdit,
  onDelete,
  handle,
}: Props) => {
  return (
    <div className="pb-2.5 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-1">
        {items.map((item, index) => (
          <Badge
            key={index}
            className="bg-muted h-7 rounded-[0.375rem] px-2 paragraph-small"
          >
            {item}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Field orientation="horizontal" className="w-fit">
          <Switch
            id={switchId}
            checked={status === "Active"}
            onCheckedChange={(c) => onStatusChange(c ? "Active" : "Inactive")}
          />
          <FieldLabel
            htmlFor={switchId}
            className="paragraph-small font-normal text-foreground"
          >
            {status}
          </FieldLabel>
        </Field>
        {!!handle ? (
          <PopoverTrigger handle={handle}>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Icon name="edit-line" size={20} />
            </Button>
          </PopoverTrigger>
        ) : (
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Icon name="edit-line" size={20} />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Icon name="delete-bin-5-line" size={20} />
        </Button>
      </div>
    </div>
  );
};
