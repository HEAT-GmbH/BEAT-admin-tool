"use client";

import FormInput from "@/components/form-input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ClimateType } from "@/models/climate-type";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent } from "react";
import {
  FormProvider,
  useController,
  useForm,
  useWatch,
} from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  type: z.string().min(1, "Climate type is required"),
  description: z.string().min(1, "Description is required"),
  status: z.union([z.literal("Active"), z.literal("Inactive")]),
});

type ClimateData = z.infer<typeof schema>;

interface ClimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ClimateType | null;
}

export const ViewClimateDialog = ({
  open,
  onOpenChange,
  item,
}: ClimateDialogProps) => {
  const { reset, handleSubmit, control, setValue, ...methods } =
    useForm<ClimateData>({
      resolver: zodResolver(schema),
    });

  const {
    field: { onChange },
  } = useController({
    control,
    name: "status",
  });

  const status = useWatch({
    control,
    name: "status",
  });

  const onSubmit = (data: ClimateData) => {
    console.log("Submit climate type:", data);
    onOpenChange(false);
    reset();
  };

  const sync = useEffectEvent(() => {
    if (item) {
      setValue("type", item.type);
      setValue("description", item.description);
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
      title="Add climate type"
      description="Add climate classifications for building assessments"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider
        handleSubmit={handleSubmit}
        control={control}
        reset={reset}
        setValue={setValue}
        {...methods}
      >
        <form
          id="add-climate-type-form"
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <FormInput
              name="type"
              label="Climate type"
              placeholder="Enter climate type"
              control={control}
              schema={schema}
              id="type"
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Enter description"
              control={control}
              schema={schema}
              id="description"
              type="textarea"
            />
            <Field orientation="horizontal" className="h-8">
              <Switch
                id="status"
                checked={status === "Active"}
                onCheckedChange={(val) => onChange(val ? "Active" : "Inactive")}
              />
              <FieldLabel
                htmlFor="status"
                className="text-foreground paragraph-small"
              >
                Status{" "}
                <span className="text-(--text--sub-600) font-normal capitalize">{`(${status})`}</span>
              </FieldLabel>
            </Field>
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
