"use client";

import { EmptySystemState } from "@/components/empty-system-state";
import FormSelect from "@/components/form-select";
import { SystemWithItems } from "@/components/system-with-items";
import {
  AddBuildingForm,
  AirConditionSystem,
  ChillerSystem,
  airConditionSystemSchema,
  chillerSystemSchema,
} from "@/screens/add-building/schema";
import { useState } from "react";
import {
  Control,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { OperationalItemDialog } from "../components/operational-item-dialog";
import { AirConditionForm } from "./air-condition-form";
import { ChillerForm } from "./chiller-form";

export function CoolingSystemScreen() {
  const { control } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "operationalDetails.coolingSystem",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Local form for the dialog
  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    reset: resetDialog,
    watch: watchDialog,
  } = useForm<ChillerSystem | AirConditionSystem>({
    defaultValues: {
      type: "chiller",
    },
  });

  const watchedType = watchDialog("type");

  const handleAddNew = () => {
    setEditingIndex(null);
    resetDialog({
      type: "chiller",
      data: {
        type: "",
        yearOfInstallation: "",
        refrigerantType: "",
        refrigerantQuantity: 0,
        totalCoolingLoad: 0,
        baselineCoolingEfficiency: 0,
        baselineLeakageFactor: 0,
        installationOfHeatRecoverySystems: false,
        installationOfVariableSpeedDrives: false,
      },
    }); // Reset to default values
    setIsDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    resetDialog(fields[index]);
    setIsDialogOpen(true);
  };

  const onSave = (data: ChillerSystem | AirConditionSystem) => {
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
          handleAddNew={handleAddNew}
          imageSrc="/cooling-system.png"
          imageAlt="Cooling System Image"
          width={127.49}
          height={105.82}
          label="Click button below to add a cooling system"
          buttonChildren="Add a cooling system"
        />
      ) : (
        <SystemWithItems
          ctaLabel="Add a cooling system"
          handleAddNew={handleAddNew}
          fields={fields.map((field, index) => {
            return {
              id: field.id ?? index.toString(),
              title: field.data.type,
              description: [
                `Type: ${field.data.refrigerantType}`,
                `Refrigerant quantity: ${field.data.refrigerantQuantity}`,
              ],
            };
          })}
          handleEdit={handleEdit}
          remove={remove}
          fieldIcon="snowflake-fill"
          systemName="cooling"
        />
      )}

      <OperationalItemDialog
        title={
          editingIndex !== null ? "Edit cooling system" : "Add a cooling system"
        }
        description="Enter details of the building’s cooling system, including type and capacity"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleDialogSubmit(onSave)}
      >
        <FormSelect
          control={dialogControl}
          name="type"
          schema={
            watchedType === "chiller"
              ? chillerSystemSchema
              : airConditionSystemSchema
          }
          id="cooling-system-type"
          label="Type of cooling system"
          placeholder="Select a cooling system"
          items={[
            { value: "chiller", item: "Chiller Systems" },
            { value: "air-condition", item: "Air condition system" },
          ]}
        />

        {watchedType === "chiller" && (
          <ChillerForm control={dialogControl as Control<ChillerSystem>} />
        )}

        {watchedType === "air-condition" && (
          <AirConditionForm
            control={dialogControl as Control<AirConditionSystem>}
          />
        )}
      </OperationalItemDialog>
    </div>
  );
}
