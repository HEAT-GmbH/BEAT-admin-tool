"use client";

import { EmptySystemState } from "@/components/empty-system-state";
import { SystemWithItems } from "@/components/system-with-items";
import {
  AddBuildingForm,
  VentilationSystem,
} from "@/screens/add-building/schema";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { OperationalItemDialog } from "../components/operational-item-dialog";
import { VentilationSystemForm } from "./ventilation-system-form";

export function VentilationSystemScreen() {
  const { control } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "operationalDetails.ventilationSystem",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    reset: resetDialog,
  } = useForm<VentilationSystem>();

  const handleAddNew = () => {
    setEditingIndex(null);
    resetDialog({
      type: "",
      capacityUnit: "",
      baselineEfficiency: 0,
      totalPowerInput: 0,
      airFlowRate: 0,
      installationOfDemandControlledVentilation: false,
      installationOfVariableSpeedDrives: false,
      totalNumberOfVentilationTypeInstalled: 0,
      totalEnergyConsumptionAnnually: 0,
      energyEfficiencyLabel: "",
      numberOfStars: "",
      systemOperatingSchedule: {
        hours: 0,
        days: 0,
        weeks: 0,
      },
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    resetDialog(fields[index]);
    setIsDialogOpen(true);
  };

  const onSave = (data: VentilationSystem) => {
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
          imageSrc="/ventilation-system.png"
          imageAlt="Ventilation system Image"
          label="Click button below to add a ventilation system"
          buttonChildren="Add ventilation system"
          handleAddNew={handleAddNew}
          width={137}
          height={72}
        />
      ) : (
        <SystemWithItems
          ctaLabel="Add a ventilation system"
          handleAddNew={handleAddNew}
          fields={fields.map((field, index) => {
            return {
              id: field.id ?? index.toString(),
              title: field.type,
              description: [
                `Airflow rate: ${field.airFlowRate}CMH`,
                `Capacity units: ${field.capacityUnit}`,
              ],
            };
          })}
          handleEdit={handleEdit}
          remove={remove}
          fieldIcon="windy-fill"
          systemName="ventilation"
        />
      )}

      <OperationalItemDialog
        title={
          editingIndex !== null
            ? "Edit ventilation system"
            : "Add a ventilation system"
        }
        description="Enter details of the building's ventilation system, including type and capacity"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleDialogSubmit(onSave)}
      >
        <VentilationSystemForm control={dialogControl} />
      </OperationalItemDialog>
    </div>
  );
}
