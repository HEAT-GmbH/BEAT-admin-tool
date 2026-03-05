"use client";

import FormInput from "@/components/form-input";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BuildingType } from "@/models/building-type";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  FormProvider,
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  type: z.string().min(1, "Building type is required"),
  hasSubTypes: z.boolean().default(false),
  subTypes: z
    .array(
      z.object({
        type: z.string().min(1, "Sub type is required"),
        isActive: z.boolean().default(true),
      }),
    )
    .min(1, "At least one sub type is required"),
});

type ViewBuildingData = z.infer<typeof schema>;

interface ViewBuildingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: BuildingType | null;
}

export const ViewBuildingDialog = ({
  open,
  onOpenChange,
  item,
}: ViewBuildingDialogProps) => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, ...formState },
    ...methods
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTypes",
  });
  const {
    field: { onChange },
  } = useController({
    control,
    name: "hasSubTypes",
  });
  const hasSubTypes = useWatch({
    control,
    name: "hasSubTypes",
  });
  const [subTypeInput, setSubTypeInput] = useState("");

  const handleAddSubType = () => {
    if (!subTypeInput.trim()) return;
    const trimmed = subTypeInput.trim();
    if (!fields.some((f) => f.type === trimmed)) {
      append({ type: trimmed, isActive: true });
    }
    setSubTypeInput("");
  };

  const handleRemoveSubType = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: ViewBuildingData) => {
    console.log("Submit building type:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add building type"
      description="Add building categories and sub-types"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider
        handleSubmit={handleSubmit}
        control={control}
        reset={reset}
        formState={{ errors, ...formState }}
        {...methods}
      >
        <form
          id="add-climate-type-form"
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <FormInput
              name="type"
              label="Building type title"
              placeholder="Enter building type"
              control={control}
              schema={schema}
              id="type"
            />
            <Field>
              <FieldLabel>
                Does building type have sub-types?{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <RadioGroup
                value={hasSubTypes}
                onValueChange={(val) => onChange(val === "true")}
              >
                <Field orientation="horizontal">
                  <RadioGroupItem id="hasSubTypes-true" value="true" />
                  <FieldLabel
                    htmlFor="hasSubTypes-true"
                    className="paragraph-small"
                  >
                    Yes
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem id="hasSubTypes-false" value="false" />
                  <FieldLabel
                    htmlFor="hasSubTypes-false"
                    className="paragraph-small"
                  >
                    No
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </Field>
            {hasSubTypes && (
              <>
                <div className="space-y-1">
                  <label className="text-(--text--strong-950) font-bold">
                    Sub building type
                  </label>
                  <p className="text-sm text-(--text--sub-600)">
                    Add sub-building type below
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-(--text--strong-950) font-medium">
                    Name of city <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter name of city here and click the add button"
                      value={subTypeInput}
                      onChange={(e) => setSubTypeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubType();
                        }
                      }}
                      className="flex-1 h-10"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-4"
                      onClick={handleAddSubType}
                    >
                      <Icon name="add-large-fill" className="h-4 w-4 mr-2" />{" "}
                      Add city
                    </Button>
                  </div>
                  {errors.subTypes && (
                    <span className="text-xs text-red-500">
                      {errors.subTypes.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {fields.map((field, index) => (
                    <Badge
                      key={field.type}
                      variant="secondary"
                      className="h-8 pl-3 pr-1 py-1 rounded-md bg-(--bg--soft-200) text-(--text--main-900) font-normal gap-1 flex items-center hover:bg-(--bg--soft-200)"
                    >
                      {field.type}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubType(index)}
                        className="rounded-full h-5 w-5 hover:bg-black/10 flex items-center justify-center text-(--icon--sub-600)"
                      >
                        <Icon name="close-line" size={20} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
