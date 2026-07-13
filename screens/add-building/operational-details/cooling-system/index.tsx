"use client";

import { EmptySystemState } from "@/components/empty-system-state";
import { SystemWithItems } from "@/components/system-with-items";
import {
  AddBuildingForm,
  AirConditionSystem,
  ChillerSystem,
  airConditionSystemSchema,
  chillerSystemSchema,
} from "@/screens/add-building/schema";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { OperationalItemDialog } from "../components/operational-item-dialog";
import { AirConditionForm } from "./air-condition-form";
import { ChillerForm } from "./chiller-form";

type CoolingSystemType = "chiller" | "air-condition";

const COOLING_TYPE_ITEMS = [
  { value: "chiller", item: "Chiller System (Water / Air cooled)" },
  { value: "air-condition", item: "Air Conditioner (Window / Split / VRF / Packaged)" },
];

const CHILLER_LABEL_MAP: Record<string, string> = {
  "water-cooled": "Water Cooled Chiller",
  "air-cooled": "Air Cooled Chiller",
};

const AC_LABEL_MAP: Record<string, string> = {
  window: "Window AC",
  split: "Split AC",
  vrv: "VRF System",
  packaged: "Packaged / Ductable AC",
};

export function CoolingSystemScreen() {
  const { control } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "operationalDetails.coolingSystem",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<CoolingSystemType>("chiller");

  const chillerForm = useForm<ChillerSystem>({
    resolver: standardSchemaResolver(chillerSystemSchema),
    defaultValues: { type: "chiller", installationOfVariableSpeedDrives: false, installationOfHeatRecoverySystems: false },
  });

  const acForm = useForm<AirConditionSystem>({
    resolver: standardSchemaResolver(airConditionSystemSchema),
    defaultValues: { type: "air-condition", coolingCapacityUnit: "ton" },
  });

  const handleAddNew = () => {
    setEditingIndex(null);
    setSelectedType("chiller");
    chillerForm.reset({ type: "chiller", installationOfVariableSpeedDrives: false, installationOfHeatRecoverySystems: false });
    acForm.reset({ type: "air-condition", coolingCapacityUnit: "ton" });
    setIsDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const field = fields[index];
    if (field.type === "chiller") {
      setSelectedType("chiller");
      chillerForm.reset(field as ChillerSystem);
    } else {
      setSelectedType("air-condition");
      acForm.reset(field as AirConditionSystem);
    }
    setIsDialogOpen(true);
  };

  const onSaveChiller = (data: ChillerSystem) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
    } else {
      append(data);
    }
    setIsDialogOpen(false);
  };

  const onSaveAC = (data: AirConditionSystem) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
    } else {
      append(data);
    }
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    if (selectedType === "chiller") {
      chillerForm.handleSubmit(onSaveChiller)();
    } else {
      acForm.handleSubmit(onSaveAC)();
    }
  };

  const getFieldLabel = (field: ChillerSystem | AirConditionSystem) => {
    if (field.type === "chiller") {
      return CHILLER_LABEL_MAP[(field as ChillerSystem).chillerType] ?? "Chiller";
    }
    const ac = field as AirConditionSystem;
    return AC_LABEL_MAP[ac.acType] ?? "Air Conditioner";
  };

  const getFieldDescription = (field: ChillerSystem | AirConditionSystem) => {
    if (field.type === "chiller") {
      const c = field as ChillerSystem;
      return [`Refrigerant: ${c.refrigerantType}`, `Qty: ${c.refrigerantQuantity} kg`];
    }
    const ac = field as AirConditionSystem;
    return [`Refrigerant: ${ac.refrigerantType}`, `Qty: ${ac.refrigerantQuantity} kg`];
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
          fields={fields.map((field, index) => ({
            id: field.id ?? index.toString(),
            title: getFieldLabel(field),
            description: getFieldDescription(field),
          }))}
          handleEdit={handleEdit}
          remove={remove}
          fieldIcon="snowflake-fill"
          systemName="cooling"
        />
      )}

      <OperationalItemDialog
        title={editingIndex !== null ? "Edit cooling system" : "Add a cooling system"}
        description="Enter details of the building's cooling system, including type and capacity"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      >
        {/* Top-level type selector */}
        <div className="pb-2 space-y-1">
          <label htmlFor="cooling-system-top-type" className="label-small text-(--text--strong-950)">
            Type of cooling system<span className="text-destructive ml-0.5">*</span>
          </label>
          <select
            id="cooling-system-top-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CoolingSystemType)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            {COOLING_TYPE_ITEMS.map((item) => (
              <option key={item.value} value={item.value}>{item.item}</option>
            ))}
          </select>
        </div>

        {selectedType === "chiller" && (
          <ChillerForm control={chillerForm.control} />
        )}

        {selectedType === "air-condition" && (
          <AirConditionForm control={acForm.control} />
        )}
      </OperationalItemDialog>
    </div>
  );
}
