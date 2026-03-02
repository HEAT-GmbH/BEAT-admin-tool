"use client";

import { EmptySystemState } from "@/components/empty-system-state";
import { SystemWithItems } from "@/components/system-with-items";
import {
  AddBuildingForm,
  LiftEscalatorSystem,
} from "@/screens/add-building/schema";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { OperationalItemDialog } from "../components/operational-item-dialog";
import { LiftEscalatorSystemForm } from "./lift-escalator-system-form";

export function LiftEscalatorSystemScreen() {
  const { control } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "operationalDetails.liftEscalatorSystem",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    reset: resetDialog,
  } = useForm<LiftEscalatorSystem>();

  const handleAddNew = () => {
    setEditingIndex(null);
    resetDialog({
      numberOfLifts: 0,
      installationOfLiftRegenerativeFeatures: false,
      installationOfVVVFAndSleepMode: false,
      annualEnergyConsumption: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    resetDialog(fields[index]);
    setIsDialogOpen(true);
  };

  const onSave = (data: LiftEscalatorSystem) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
    } else {
      append(data);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full">
      {fields.length === 0 ? (
        <EmptySystemState
          imageSrc="/lift-escalator-system.png"
          imageAlt="Lift escalator system Image"
          label="Click button below to add a lift & escalator system"
          buttonChildren="Add lift & escalator system"
          handleAddNew={handleAddNew}
          width={115}
          height={99}
        />
      ) : (
        <SystemWithItems
          ctaLabel="Add a lift & escalator system"
          handleAddNew={handleAddNew}
          fields={fields.map((field, index) => {
            return {
              id: field.id ?? index.toString(),
              title: `Lift & Escalator ${index + 1}`,
              description: [
                field.installationOfLiftRegenerativeFeatures
                  ? "Lift Regenerative Features"
                  : "",
                field.installationOfVVVFAndSleepMode
                  ? "VVVF and Sleep Mode"
                  : "",
              ],
            };
          })}
          handleEdit={handleEdit}
          remove={remove}
          fieldIcon="stairs-line"
          systemName="lift & escalator"
        />
      )}

      <OperationalItemDialog
        title={
          editingIndex !== null
            ? "Edit lift & escalator system"
            : "Add a lift & escalator system"
        }
        description="Provide details on lift & escalator system."
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleDialogSubmit(onSave)}
      >
        <LiftEscalatorSystemForm control={dialogControl} />
      </OperationalItemDialog>
    </div>
  );
}
