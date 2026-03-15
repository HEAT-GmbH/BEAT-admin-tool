"use client";

import FormInput from "@/components/form-input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ClimateType } from "@/models/climate-type";
import { SSDialog } from "@/screens/components/dialog";
import { useClimateTypesContext } from "@/screens/system-settings/climate/context";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
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
  status: z.union([z.literal("active"), z.literal("inactive")]),
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
  const { updateClimateType, isMutating } = useClimateTypesContext();

  const { data: detail } = useQuery({
    queryKey: ["climate-type-detail", item?.id],
    queryFn: () => apiService.getClimateTypeDetail(item!.id),
    enabled: open && !!item,
  });

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

  const onSubmit = async (data: ClimateData) => {
    if (!item) return;
    await updateClimateType(item.id, { name: data.type, description: data.description, status: data.status });
    onOpenChange(false);
    reset();
  };

  const sync = useEffectEvent(() => {
    if (detail) {
      setValue("type", detail.name);
      setValue("description", detail.description);
      setValue("status", detail.status);
    } else if (!item) {
      reset();
    }
  });

  useEffect(() => {
    sync();
  }, [detail, item]);

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add climate type"
      description="Add climate classifications for building assessments"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isMutating}
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
                checked={status === "active"}
                onCheckedChange={(val) => onChange(val ? "active" : "inactive")}
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
