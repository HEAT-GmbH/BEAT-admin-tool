"use client";

import {
  AddBuildingForm,
  OperationalDataEntry,
} from "@/screens/add-building/schema";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { OperationalDataEntryProvider } from "./operational-data-entry.context";
import { OperationalDataEntryDialog } from "./dialog";
import { OperationalDataEntryForm } from "./form";
import { EmptySystemState } from "@/components/empty-system-state";
import { SystemWithItems } from "@/components/system-with-items";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OperationalDataEntryScreen() {
  const { control } = useFormContext<AddBuildingForm>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "operationalDataEntry",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    reset: resetDialog,
  } = useForm<OperationalDataEntry>();

  const handleAddNew = () => {
    resetDialog();
    setIsDialogOpen(true);
  };

  const onSave = (data: OperationalDataEntry) => {
    append(data);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    resetDialog();
    setIsDialogOpen(false);
  };

  const handleExternal = (index: number) => {
    console.log(index);
  };

  const handleEdit = (index: number, data: Partial<OperationalDataEntry>) => {
    const field = fields[index];
    update(index, {
      ...field,
      ...data,
    });
    setIsDialogOpen(true);
  };

  return (
    <OperationalDataEntryProvider>
      {fields.length === 0 ? (
        <EmptySystemState
          handleAddNew={handleAddNew}
          imageSrc="/energy-carrier.png"
          imageAlt="Energy Carrier Image"
          width={72}
          height={90.6}
          label="Click button below to add a energy carrier"
          buttonChildren="Add a energy carrier"
        />
      ) : (
        <SystemWithItems
          ctaLabel="Add a energy carrier"
          handleAddNew={handleAddNew}
          fields={fields.map((field, index) => {
            return {
              id: field.id ?? index.toString(),
              title: field.childCategory,
              description: (index) => (
                <OperationalDataEntryDescription
                  description={field.description || ""}
                  quantity={field.quantity || 0}
                  onEditDescription={(description) =>
                    handleEdit(index, { description })
                  }
                  onEditQuantity={(quantity) => handleEdit(index, { quantity })}
                />
              ),
            };
          })}
          handleEdit={handleExternal}
          isEditable={false}
          remove={remove}
          fieldIcon="snowflake-fill"
          systemName="cooling"
        />
      )}
      <OperationalDataEntryDialog
        title="Energy Carrier Emission Factor"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleDialogSubmit(onSave)}
        onCancel={handleCancel}
      >
        <OperationalDataEntryForm />
      </OperationalDataEntryDialog>
    </OperationalDataEntryProvider>
  );
}

function OperationalDataEntryDescription({
  description,
  quantity,
  onEditDescription,
  onEditQuantity,
}: {
  description: string;
  quantity: number;
  onEditDescription: (str: string) => void;
  onEditQuantity: (num: number) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full space-y-1">
      {show && (
        <div className="flex items-center justify-between">
          <Input
            className="flex-1"
            value={description}
            onChange={(e) => onEditDescription(e.target.value)}
            placeholder="Add a description"
          />
          <InputGroup>
            <InputGroupInput
              value={quantity}
              onChange={(e) => onEditQuantity(Number(e.target.value))}
              placeholder="Quantity"
              type="number"
            />
            <InputGroupAddon align="inline-end">
              <Select defaultValue="kg">
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent className="min-w-none w-fit">
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
                  <SelectItem value="kwh">kwh</SelectItem>
                  <SelectItem value="m3">m3</SelectItem>
                </SelectContent>
              </Select>
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="text-(--text--sub-600) text-xs font-normal"
      >
        {show ? "Hide description or quantity" : "Edit description or quantity"}
      </button>
    </div>
  );
}
