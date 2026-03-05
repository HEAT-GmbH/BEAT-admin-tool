"use client";

import FormInput from "@/components/form-input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { HotWaterSystemFactor } from "@/models/hot-water-system";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent } from "react";
import { useController, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  type: z.string().min(1, "Name is required"),
  status: z.union([z.literal("Active"), z.literal("Inactive")]),
});

type ViewHotWaterSystemData = z.infer<typeof schema>;

interface ViewHotWaterSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: HotWaterSystemFactor | null;
}

export const ViewHotWaterSystemDialog = ({
  open,
  onOpenChange,
  item,
}: ViewHotWaterSystemDialogProps) => {
  const { reset, handleSubmit, control, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "status",
  });

  const onSubmit = (data: ViewHotWaterSystemData) => {
    console.log("Submit building type:", data);
    onOpenChange(false);
    reset();
  };

  const sync = useEffectEvent(() => {
    if (item) {
      setValue("type", item.type);
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
      title="Hot Water System"
      description="Complete the input form below to add a new hot water system."
      onSubmit={handleSubmit(onSubmit)}
    >
      <form
        id="view-hot-water-system-form"
        className="flex flex-col h-full overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <FormInput
            id="type"
            schema={schema}
            control={control}
            name="type"
            label="Hot water system"
            placeholder="Enter hot water system name"
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
