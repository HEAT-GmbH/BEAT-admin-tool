"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { AddBuildingForm, LightingSystem } from "@/screens/add-building/schema";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { OperationalItemDialog } from "../components/operational-item-dialog";
import { LightingSystemForm } from "./lighting-system-form";
import { EmptySystemState } from "@/components/empty-system-state";
import { SystemWithItems } from "@/components/system-with-items";

export function LightingSystemScreen() {
  const { control } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "operationalDetails.lightingSystem",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    reset: resetDialog,
  } = useForm<LightingSystem>();

  const handleAddNew = () => {
    setEditingIndex(null);
    resetDialog({
      type: "",
      roomArea: 0,
      lightBulbType: "",
      numberOfLightingBulbs: 0,
      lightingBulbPowerRating: 0,
      systemOperatingSchedule: {
        hours: 0,
        days: 0,
        weeks: 0,
      },
      installationOfSensors: false,
      baselineLightingPowerDensity: 0,
      totalEnergyConsumptionAnnually: 0,
      energyEfficiencyLabel: "",
      numberOfStars: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    resetDialog(fields[index]);
    setIsDialogOpen(true);
  };

  const onSave = (data: LightingSystem) => {
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
          imageSrc="/lighting-system.png"
          imageAlt="Lighting system Image"
          label="Click button below to add a lighting system"
          buttonChildren="Add lighting system"
          handleAddNew={handleAddNew}
          width={68}
          height={113}
        />
      ) : (
        <SystemWithItems
          ctaLabel="Add a lighting system"
          handleAddNew={handleAddNew}
          fields={fields.map((field, index) => {
            return {
              id: field.id ?? index.toString(),
              title: field.type,
              description: [
                `Room area: ${field.roomArea}m²`,
                `Light bulb type: ${field.lightBulbType}`,
              ],
            };
          })}
          handleEdit={handleEdit}
          remove={remove}
          fieldIcon="lightbulb-line"
          systemName="lighting"
        />
      )}

      <OperationalItemDialog
        title={
          editingIndex !== null
            ? "Edit lighting system"
            : "Add a lighting system"
        }
        description="Provide details on lighting types, power use, and controls to assess efficiency."
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleDialogSubmit(onSave)}
      >
        <LightingSystemForm control={dialogControl} />
      </OperationalItemDialog>
    </div>
  );
}
