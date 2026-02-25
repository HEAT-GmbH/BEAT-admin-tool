"use client";

import FormInput from "@/components/form-input";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { BoQData, boqSchema } from "../../schema";
import { MaterialsList } from "./materials-list";
import { BuildingStructuralDialog } from "./dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  control: Control<BoQData>;
  handleSubmit: UseFormHandleSubmit<BoQData>;
  onSave: (data: BoQData) => void;
  onAddFromEpd: () => void;
  isEditing?: boolean;
}

export function BoQDialog({
  open,
  onOpenChange,
  control,
  handleSubmit,
  onSave,
  onAddFromEpd,
  isEditing,
}: Props) {
  return (
    <BuildingStructuralDialog
      title={
        isEditing ? "Edit Build of Quantity (BOQ)" : "Build of Quantity (BOQ)"
      }
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
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
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5">
        <FormInput
          control={control}
          name="name"
          schema={boqSchema as any}
          id="boq-name"
          label="Name"
          placeholder="eg. Fence wall"
          fieldRequired
        />
        <FormInput
          control={control}
          name="comment"
          schema={boqSchema as any}
          id="boq-comment"
          label="Comment"
          placeholder="Add a comment"
        />
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
