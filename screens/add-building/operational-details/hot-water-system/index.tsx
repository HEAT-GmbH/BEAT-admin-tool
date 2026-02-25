"use client";

import { EmptySystemState } from "@/components/empty-system-state";
import { SystemWithItems } from "@/components/system-with-items";
import { AddBuildingForm, HotWaterSystem } from "@/screens/add-building/schema";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { OperationalItemDialog } from "../components/operational-item-dialog";
import { HotWaterSystemForm } from "./hot-water-system-form";

export function HotWaterSystemScreen() {
  const { control } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "operationalDetails.hotWaterSystem",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    reset: resetDialog,
  } = useForm<HotWaterSystem>();

  const handleAddNew = () => {
    setEditingIndex(null);
    resetDialog({
      type: "",
      fuelType: "",
      systemOperatingSchedule: {
        hours: 0,
        days: 0,
        weeks: 0,
      },
      fuelConsumption: 0,
      powerInput: 0,
      baselineEfficiency: 0,
      baselineEquipmentEfficiencyLevel: 0,
      installationOfHeatRecoverySystem: false,
      numberOfEquipment: 0,
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

  const onSave = (data: HotWaterSystem) => {
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
          imageSrc="/hot-water-system.png"
          imageAlt="Hot water system Image"
          label="Click button below to add a hot water system"
          buttonChildren="Add hot water system"
          handleAddNew={handleAddNew}
          width={75}
          height={91.3}
        />
      ) : (
        <SystemWithItems
          ctaLabel="Add a hot water system"
          handleAddNew={handleAddNew}
          fields={fields.map((field, index) => {
            return {
              id: field.id ?? index.toString(),
              title: `Hot water system ${index + 1}`,
              description: [
                field.installationOfHeatRecoverySystem
                  ? "Installation of Heat Recovery System"
                  : "",
              ],
            };
          })}
          handleEdit={handleEdit}
          remove={remove}
          fieldIcon="temp-cold-line"
          systemName="hot water"
        />
      )}

      <OperationalItemDialog
        title={
          editingIndex !== null
            ? "Edit hot water system"
            : "Add a hot water system"
        }
        description="Provide details on the building’s method of producing and distributing hot water."
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleDialogSubmit(onSave)}
      >
        <HotWaterSystemForm control={dialogControl} />
      </OperationalItemDialog>
    </div>
  );
}
