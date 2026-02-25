"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { countriesService } from "@/services/countries.service";
import { CircleFlag } from "react-circle-flags";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  useController,
  useWatch,
} from "react-hook-form";
import {
  StructuralComponentData,
  structuralComponentSchema,
} from "../../schema";
import { BuildingStructuralDialog } from "./dialog";
import { MaterialsList } from "./materials-list";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  control: Control<StructuralComponentData>;
  handleSubmit: UseFormHandleSubmit<StructuralComponentData>;
  onSave: (data: StructuralComponentData) => void;
  onAddFromEpd: () => void;
  isEditing?: boolean;
}

export function ComponentDialog({
  open,
  onOpenChange,
  control,
  handleSubmit,
  onSave,
  onAddFromEpd,
  isEditing,
}: Props) {
  const [saveAsComp, setSaveAsComp] = useState(false);

  return (
    <BuildingStructuralDialog
      title={isEditing ? "Edit Component" : "Create New Component"}
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Field orientation="horizontal">
            <Checkbox
              name="isPublic"
              id="comp-is-public"
              checked={saveAsComp}
              onCheckedChange={(checked) => setSaveAsComp(checked)}
            />
            <FieldLabel htmlFor="comp-is-public">
              Save this as a reusable component
            </FieldLabel>
          </Field>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="ml-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSave)}>
              {isEditing ? "Update" : "Done"}
            </Button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        <FormInput
          control={control}
          name="title"
          schema={structuralComponentSchema as any}
          id="comp-title"
          label="Title"
          placeholder="eg. Fence wall"
          fieldRequired
          fieldClassName="col-span-1"
        />
        <FormSelect
          control={control}
          name="country"
          schema={structuralComponentSchema as any}
          id="comp-country"
          label="Country"
          placeholder="Select Country"
          items={countriesService.getCountries().map((c) => ({
            value: c.code,
            item: (
              <div className="flex items-center gap-2">
                <CircleFlag
                  countryCode={c.code.toLowerCase()}
                  className="size-5"
                />
                {c.name}
              </div>
            ),
          }))}
        />
        <FormSelect
          control={control}
          name="buildingComponent"
          schema={structuralComponentSchema as any}
          id="comp-building-component"
          label="Building Component"
          placeholder="Select an option"
          fieldRequired
          items={[
            { value: "ext-staircase", item: "Extension - Staircase and Ramps" },
            { value: "ext-finishes", item: "Extension - Finishes" },
            { value: "ext-misc", item: "Extension - Miscellaneous" },
            {
              value: "hor-structural-elements-beams",
              item: "Horizontal Structural Elements - Beams, Slabs",
            },
            { value: "mem01", item: "MEM01 - Bottom floor construction" },
            { value: "mem02", item: "MEM02 - Intermediate floor construction" },
            { value: "mem04", item: "MEM04 - Roof construction" },
            { value: "mem05", item: "MEM05 - External walls" },
            { value: "mem06", item: "MEM06 - Interior walls" },
            { value: "mem08", item: "MEM08 - Window glazing" },
            { value: "mem09", item: "MEM09 - Roof insulation" },
            { value: "mem10", item: "MEM10 - Wall insulation" },
          ]}
        />
        <FormSelect
          control={control}
          name="constructionTechnique"
          schema={structuralComponentSchema as any}
          id="comp-technique"
          label="Construction technique"
          placeholder="Select an option"
          disabled={false} // Match HTML disabled state if needed, but schema allows it
          items={[
            { value: "in-situ", item: "In-Situ Reinforced Concrete Beams" },
            { value: "precast", item: "Precast Reinforced Concrete Beams" },
          ]}
        />
        <FormSelect
          control={control}
          name="mode"
          schema={structuralComponentSchema as any}
          id="comp-mode"
          label="Mode"
          placeholder="Select a mode"
          items={[
            { value: "custom", item: "Custom" },
            { value: "selection", item: "Selection" },
          ]}
        />
        <div className="flex items-end gap-1">
          <FormInput
            control={control}
            name="quantity"
            schema={structuralComponentSchema as any}
            id="comp-quantity"
            label="Quantity"
            placeholder="Enter quantity"
            type="number"
            fieldClassName="flex-1"
          />
          <FormSelect
            control={control}
            name="unit"
            schema={structuralComponentSchema as any}
            id="comp-unit"
            placeholder="Unit"
            fieldClassName="w-24"
            items={[
              { value: "m2", item: "m²" },
              { value: "m", item: "m" },
              { value: "kg", item: "kg" },
              { value: "m3", item: "m³" },
              { value: "pcs", item: "pcs" },
            ]}
          />
        </div>

        <FormInput
          control={control}
          name="comment"
          schema={structuralComponentSchema as any}
          id="comp-comment"
          label="Comment"
          placeholder="Add a comment"
          fieldClassName="col-span-3"
          type="textarea"
        />

        <div className="col-span-3">
          <Controller
            control={control}
            name="isPublic"
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="make-public"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel
                  htmlFor="make-public"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <span className="text-sm font-medium">Make Public</span>
                  <span className="text-xs text-(--text--sub-600)">
                    (Make this component public)
                  </span>
                </FieldLabel>
              </Field>
            )}
          />
        </div>
      </div>

      <div className="mt-8">
        <MaterialsList
          control={control}
          name="materials"
          onAddFromEpd={onAddFromEpd}
        />
      </div>
    </BuildingStructuralDialog>
  );
}
