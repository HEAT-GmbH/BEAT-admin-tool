"use client";

import FormInput from "@/components/form-input";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { CoolingSystemFactor } from "@/models/cooling-system";
import { AddSSDialog } from "@/screens/components/add-dialog";
import { ChipList } from "@/screens/components/chip-list";
import { SSDialog } from "@/screens/components/dialog";
import { LabelWithDesc } from "@/screens/components/label-with-desc";
import { ViewItem } from "@/screens/components/view-item";
import { ViewItemHeader } from "@/screens/components/view-item-header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const addsubType = z.object({
  name: z.string().optional(),
  subTypes: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
      }),
    )
    .min(1, "At least one sub-type is required"),
});
const addRefrigerant = z.object({
  name: z.string().optional(),
  refrigerants: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
      }),
    )
    .min(1, "At least one sub-type is required"),
});
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  hasSubType: z.union([z.literal("Yes"), z.literal("No")]),
  status: z.union([z.literal("Active"), z.literal("Inactive")]),
  subTypes: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      isActive: z.boolean(),
    }),
  ),
  refrigerants: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      isActive: z.boolean(),
    }),
  ),
});

type ViewCoolingSystemData = z.infer<typeof schema>;

interface ViewCoolingSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CoolingSystemFactor | null;
}

export const ViewCoolingSystemDialog = ({
  open,
  onOpenChange,
  item,
}: ViewCoolingSystemDialogProps) => {
  const [openAddSubTypeDialog, setOpenAddSubTypeDialog] = useState(false);
  const [openAddRefrigerantDialog, setOpenAddRefrigerantDialog] =
    useState(false);

  const { reset, handleSubmit, control, setValue } = useForm<ViewCoolingSystemData>({
    resolver: zodResolver(schema),
  });
  const {
    fields: subTypes,
    append: appendSubType,
    remove: removeSubType,
    update: updateSubType,
  } = useFieldArray({
    control,
    name: "subTypes",
  });
  const {
    fields: refrigerants,
    append: appendRefrigerant,
    remove: removeRefrigerant,
    update: updateRefrigerant,
  } = useFieldArray({
    control,
    name: "refrigerants",
  });

  const onAddSubType = (data: z.infer<typeof addsubType>["subTypes"]) => {
    data.forEach((subType) => {
      appendSubType({
        name: subType.name,
        isActive: true,
      });
    });
  };

  const onAddRefrigerant = (
    data: z.infer<typeof addRefrigerant>["refrigerants"],
  ) => {
    data.forEach((refrigerant) => {
      appendRefrigerant({
        name: refrigerant.name,
        isActive: true,
      });
    });
  };

  const onSubmit = (data: ViewCoolingSystemData) => {
    console.log("Submit building type:", data);
    onOpenChange(false);
    reset();
  };

  if (!item) {
    return null;
  }

  return (
    <>
      <SSDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Cooling system detail"
        description="Manage cooling system"
        onSubmit={handleSubmit(onSubmit)}
      >
        <form
          id="add-climate-type-form"
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <ViewItemHeader
              icon={
                <Icon
                  name="snowflake-line"
                  size={24}
                  color="var(--icon--strong-950)"
                />
              }
              title={`${item.name} system`}
              status={item.status}
              onStatusChange={(status) => setValue("status", status)}
            />
            <div className="flex items-center justify-between gap-4">
              <LabelWithDesc
                label="Cooling system sub-type"
                description="View & edit cooling sub-type"
              />
              <Button
                variant="outline"
                onClick={() => setOpenAddSubTypeDialog(true)}
              >
                <Icon
                  name="add-large-fill"
                  size={24}
                  color="var(--icon--strong-950)"
                />
                Sub-type
              </Button>
            </div>
            <ul className="grid grid-cols-1 gap-4">
              {subTypes.map((subType, index) => (
                <li key={subType.id}>
                  <ViewItem
                    items={[subType.name]}
                    status={subType.isActive ? "Active" : "Inactive"}
                    onStatusChange={(status) => {
                      const item = subTypes[index];
                      updateSubType(index, {
                        ...item,
                        isActive: status === "Active",
                      });
                    }}
                    onEdit={() => {}}
                    switchId={`sub-type-switch-${index}`}
                    onDelete={() => removeSubType(index)}
                  />
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4">
              <LabelWithDesc
                label="Refrigerant"
                description="View & edit refrigerant"
              />
              <Button
                variant="outline"
                onClick={() => setOpenAddRefrigerantDialog(true)}
              >
                <Icon
                  name="add-large-fill"
                  size={24}
                  color="var(--icon--strong-950)"
                />
                Refrigerant
              </Button>
            </div>
            <ul className="grid grid-cols-1 gap-4">
              {refrigerants.map((refrigerant, index) => (
                <li key={refrigerant.id}>
                  <ViewItem
                    items={[refrigerant.name]}
                    status={refrigerant.isActive ? "Active" : "Inactive"}
                    onStatusChange={(status) => {
                      const item = refrigerants[index];
                      updateRefrigerant(index, {
                        ...item,
                        isActive: status === "Active",
                      });
                    }}
                    onEdit={() => {}}
                    switchId={`refrigerant-switch-${index}`}
                    onDelete={() => removeRefrigerant(index)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </form>
      </SSDialog>
      <AddSubTypeDialog
        open={openAddSubTypeDialog}
        onOpenChange={setOpenAddSubTypeDialog}
        onSubmit={onAddSubType}
      />
      <AddRefrigerantDialog
        open={openAddRefrigerantDialog}
        onOpenChange={setOpenAddRefrigerantDialog}
        onSubmit={onAddRefrigerant}
      />
    </>
  );
};

interface AddSubTypeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof addsubType>["subTypes"]) => void;
}

function AddSubTypeDialog({ open, onOpenChange, onSubmit }: AddSubTypeProps) {
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof addsubType>>({
    resolver: zodResolver(addsubType),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTypes",
  });

  const onAdd = () => {
    const name = getValues("name");
    if (!name) {
      setValue("name", "");
      return;
    }
    append({ name });
    setValue("name", "");
  };

  const submit = (data: z.infer<typeof addsubType>) => {
    onSubmit(data.subTypes);
    onOpenChange(false);
    reset();
  };

  return (
    <AddSSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add sub-type"
      description="Complete the fields below to add a cooling system sub-type"
      onSubmit={handleSubmit(submit)}
      nextLabel="Add sub-types"
    >
      <form id="add-sub-type-form" className="space-y-4">
        <div className="flex items-end gap-2 w-full">
          <FormInput
            id="name"
            label="Sub-type name"
            control={control}
            schema={addsubType}
            name="name"
            placeholder="Enter sub-type name"
          />
          <Button variant="outline" onClick={onAdd}>
            <Icon
              name="add-large-fill"
              size={24}
              color="var(--icon--strong-950)"
            />
            Add
          </Button>
        </div>
        <ChipList list={fields} onRemove={remove} />
        {!!errors.subTypes?.message && (
          <p className="text-destructive text-sm">{errors.subTypes.message}</p>
        )}
      </form>
    </AddSSDialog>
  );
}

interface AddRefrigerantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof addRefrigerant>["refrigerants"]) => void;
}

function AddRefrigerantDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddRefrigerantProps) {
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof addRefrigerant>>({
    resolver: zodResolver(addRefrigerant),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "refrigerants",
  });

  const onAdd = () => {
    const name = getValues("name");
    if (!name) {
      setValue("name", "");
      return;
    }
    append({ name });
    setValue("name", "");
  };

  const submit = (data: z.infer<typeof addRefrigerant>) => {
    onSubmit(data.refrigerants);
    reset();
    onOpenChange(false);
  };

  return (
    <AddSSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add refrigerant"
      description="Complete the fields below to add a cooling system refrigerant"
      onSubmit={handleSubmit(submit)}
      nextLabel="Add refrigerants"
    >
      <form id="add-sub-type-form" className="space-y-4">
        <div className="flex items-end gap-2 w-full">
          <FormInput
            id="name"
            label="Refrigerant name"
            control={control}
            schema={addRefrigerant}
            name="name"
            placeholder="Enter refrigerant name"
          />
          <Button variant="outline" onClick={onAdd}>
            <Icon
              name="add-large-fill"
              size={24}
              color="var(--icon--strong-950)"
            />
            Add
          </Button>
        </div>
        <ChipList list={fields} onRemove={remove} />
        {!!errors.refrigerants?.message && (
          <p className="text-destructive text-sm">
            {errors.refrigerants.message}
          </p>
        )}
      </form>
    </AddSSDialog>
  );
}
