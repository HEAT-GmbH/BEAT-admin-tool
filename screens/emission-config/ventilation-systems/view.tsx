"use client";

import FormInput from "@/components/form-input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { VentilationSystemFactor } from "@/models/ventilation-system";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent } from "react";
import { useController, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.union([z.literal("Active"), z.literal("Inactive")]),
});

type ViewVentilationSystemData = z.infer<typeof schema>;

interface ViewVentilationSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: VentilationSystemFactor | null;
}

export const ViewVentilationSystemDialog = ({
  open,
  onOpenChange,
  item,
}: ViewVentilationSystemDialogProps) => {
  const { reset, handleSubmit, control, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "status",
  });

  const onSubmit = (data: ViewVentilationSystemData) => {
    console.log("Submit building type:", data);
    onOpenChange(false);
    reset();
  };

  const sync = useEffectEvent(() => {
    if (item) {
      setValue("name", item.name);
      setValue("status", item.status);
    } else {
      reset();
    }
  });
  useEffect(() => {
    sync();
  }, [item]);

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ventilation system detail"
      description="Manage ventilation system"
      onSubmit={handleSubmit(onSubmit)}
    >
      <form
        id="view-ventilation-system-form"
        className="flex flex-col h-full overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <FormInput
            id="name"
            schema={schema}
            control={control}
            name="name"
            label="Ventilation system"
            placeholder="Enter ventilation system name"
          />
          <Field orientation="horizontal">
            <Switch
              checked={value === "Active"}
              onCheckedChange={(checked) =>
                onChange(checked ? "Active" : "Inactive")
              }
              id="status"
            />
            <FieldLabel htmlFor="status">
              Status{" "}
              <span className="text-(--text--sub-600)">{`(${value})`}</span>
            </FieldLabel>
          </Field>
        </div>
      </form>
    </SSDialog>
  );
};
