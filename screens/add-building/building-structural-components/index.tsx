"use client";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import {
  AddBuildingForm,
  buildingStructuralComponentSchema,
  Material,
  BoQData,
  StructuralComponentData,
} from "../schema";
import { EPD } from "@/models/epd";
import { useState } from "react";
import { SystemWithItems } from "@/components/system-with-items";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoQDialog } from "./components/boq-dialog";
import { ComponentDialog } from "./components/component-dialog";
import { EpdLibraryDialog } from "@/components/epd-library-dialog";

export function BuildingStructuralComponentsScreen() {
  const { control: mainControl } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control: mainControl,
    name: "buildingStructuralComponents",
  });

  const [isBoQOpen, setIsBoQOpen] = useState(false);
  const [isCompOpen, setIsCompOpen] = useState(false);
  const [isEpdOpen, setIsEpdOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form for BoQ Dialog
  const {
    control: boqControl,
    reset: boqReset,
    handleSubmit: boqHandleSubmit,
  } = useForm<BoQData>({
    resolver: zodResolver(buildingStructuralComponentSchema.options[0]) as any,
    defaultValues: {
      type: "boq",
      name: "",
      comment: "",
      materials: [],
    },
  });

  // Form for Component Dialog
  const {
    control: compControl,
    reset: compReset,
    handleSubmit: compHandleSubmit,
  } = useForm<StructuralComponentData>({
    resolver: zodResolver(buildingStructuralComponentSchema.options[1]) as any,
    defaultValues: {
      type: "component",
      title: "",
      buildingComponent: "",
      mode: "custom",
      quantity: 0,
      unit: "m2",
      isPublic: false,
      materials: [],
    },
  });

  const { append: appendBoqMaterial } = useFieldArray({
    control: boqControl,
    name: "materials",
  });

  const { append: appendCompMaterial } = useFieldArray({
    control: compControl,
    name: "materials",
  });

  const handleAddNewBoQ = () => {
    setEditingIndex(null);
    boqReset({
      type: "boq",
      name: "",
      comment: "",
      materials: [],
    });
    setIsBoQOpen(true);
  };

  const handleAddNewComp = () => {
    setEditingIndex(null);
    compReset({
      type: "component",
      title: "",
      buildingComponent: "",
      mode: "custom",
      quantity: 0,
      unit: "m2",
      isPublic: false,
      materials: [],
    });
    setIsCompOpen(true);
  };

  const handleEdit = (index: number) => {
    const field = fields[index];
    setEditingIndex(index);
    if (field.type === "boq") {
      boqReset(field);
      setIsBoQOpen(true);
    } else {
      compReset(field);
      setIsCompOpen(true);
    }
  };

  const onSaveBoQ = (data: BoQData) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
    } else {
      append(data);
    }
    setIsBoQOpen(false);
  };

  const onSaveComp = (data: StructuralComponentData) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
    } else {
      append(data);
    }
    setIsCompOpen(false);
  };

  const handleAddMaterial = (items: (EPD & { quantity: number })[]) => {
    const materials: Material[] = items.map((item) => ({
      name: item.name,
      category: "others",
      quantity: item.quantity,
      unit: "kg",
      country: item.country,
    }));

    if (isBoQOpen) {
      materials.forEach((m) => appendBoqMaterial(m));
    } else if (isCompOpen) {
      materials.forEach((m) => appendCompMaterial(m));
    }

    setIsEpdOpen(false);
    return "success" as const;
  };

  const ctaSection = (
    <div className="w-full flex items-stretch gap-1.5">
      <Button
        onClick={handleAddNewBoQ}
        variant="outline"
        className="flex-1 border-(--stroke--strong-950)"
      >
        <Icon name="add-large-fill" size={20} />
        Add from Build of Quantity
        <Icon name="information-fill" color="var(--icon--soft-400)" />
      </Button>
      <Button
        onClick={handleAddNewComp}
        variant="outline"
        className="flex-1 border-(--stroke--strong-950)"
      >
        <Icon name="add-large-fill" size={20} />
        Add by component
        <Icon name="information-fill" color="var(--icon--soft-400)" />
      </Button>
    </div>
  );

  return (
    <>
      {!fields.length ? (
        <div className="w-full flex flex-col gap-3 items-center justify-center py-10">
          <Image
            width={190}
            height={117}
            src="/structural-component.png"
            alt="Structural component image"
          />
          <p className="text-sm/5 text-(--text--sub-600)">
            How would you like to add your building structural components.
          </p>
          {ctaSection}
        </div>
      ) : (
        <SystemWithItems
          systemName="structural component"
          fields={fields.map((field, index) => ({
            id: field.id ?? index.toString(),
            title: field.type === "boq" ? field.name : field.title,
            description:
              field.type === "boq"
                ? ["Bill of quantities"]
                : [field.buildingComponent, `${field.quantity} ${field.unit}`],
            icon: "building-3-line",
          }))}
          handleEdit={handleEdit}
          remove={remove}
          ctaSection={ctaSection}
        />
      )}

      <BoQDialog
        open={isBoQOpen}
        onOpenChange={setIsBoQOpen}
        control={boqControl}
        handleSubmit={boqHandleSubmit}
        onSave={onSaveBoQ}
        onAddFromEpd={() => setIsEpdOpen(true)}
        isEditing={editingIndex !== null}
      />

      <ComponentDialog
        open={isCompOpen}
        onOpenChange={setIsCompOpen}
        control={compControl}
        handleSubmit={compHandleSubmit}
        onSave={onSaveComp}
        onAddFromEpd={() => setIsEpdOpen(true)}
        isEditing={editingIndex !== null}
      />

      <EpdLibraryDialog
        isOpen={isEpdOpen}
        onOpenChange={setIsEpdOpen}
        onSubmit={handleAddMaterial}
      />
    </>
  );
}
