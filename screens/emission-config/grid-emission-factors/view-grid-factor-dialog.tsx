"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { GridEmissionFactor } from "@/models/grid-emission-factor";
import { AddSSDialog } from "@/screens/components/add-dialog";
import { SSDialog } from "@/screens/components/dialog";
import { countriesService } from "@/services/countries.service";
import { Popover as PopoverRoot } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent, useState } from "react";
import { CircleFlag } from "react-circle-flags";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import * as z from "zod";

const handle = PopoverRoot.createHandle();

const addGridFactorSchema = z.object({
  year: z.string().min(1, "Year is required"),
  gridFactor: z.coerce.number().min(0.001, "Grid factor is required"),
  unit: z.string().min(1, "Unit of measure is required"),
  status: z.union([z.literal("Active"), z.literal("Inactive")]),
});

const schema = z.object({
  country: z.string().min(1, "Country is required"),
  gridFactors: z.array(
    z.object({
      year: z.string().min(1, "Year is required"),
      gridFactor: z.coerce.number().min(0.001, "Grid factor is required"),
      unit: z.string().min(1, "Unit of measure is required"),
      status: z.union([z.literal("Active"), z.literal("Inactive")]),
    }),
  ),
  status: z.union([z.literal("Active"), z.literal("Inactive")]),
});

type ViewGridFactorData = z.infer<typeof schema>;

const editSchema = z.object({
  factor: z.coerce.number().min(0.001, "Factor is required"),
  year: z.string().min(1, "Year is required"),
});

interface ViewGridFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: GridEmissionFactor | null;
}

export const ViewGridFactorDialog = ({
  open,
  onOpenChange,
  item,
}: ViewGridFactorDialogProps) => {
  const [addNewGridFactor, setAddNewGridFactor] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, ...formState },
    setValue,
    ...methods
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "gridFactors",
  });

  const {
    control: editControl,
    handleSubmit: editHandleSubmit,
    reset: editReset,
    setValue: editSetValue,
    ...editMethods
  } = useForm({
    resolver: zodResolver(editSchema),
  });

  const country = useWatch({ control, name: "country" });
  const status = useWatch({ control, name: "status" });

  const {
    handleSubmit: addHandleSubmit,
    control: addControl,
    setValue: addSetValue,
    reset: addReset,
  } = useForm({
    resolver: zodResolver(addGridFactorSchema),
  });
  const addStatus = useWatch({ control: addControl, name: "status" });

  const onSubmit = (data: ViewGridFactorData) => {
    console.log("Submit building type:", data);
    onOpenChange(false);
    reset();
  };

  const addOnSubmit = (data: z.infer<typeof addGridFactorSchema>) => {
    append(data);
    setAddNewGridFactor(false);
    addReset();
  };

  const toggleStatus = (index: number, val: boolean) => {
    const gridFactor = fields[index];
    update(index, { ...gridFactor, status: val ? "Active" : "Inactive" });
  };

  const sync = useEffectEvent(() => {
    if (!item) {
      reset();
      return;
    }

    setValue("country", item.country);
    setValue("gridFactors", item.gridFactors);
    setValue("status", item.status);
  });
  useEffect(() => {
    sync();
  }, [item]);

  const editSync = useEffectEvent(() => {
    if (editIndex === -1) {
      editReset();
      return;
    }

    editSetValue("factor", fields[editIndex].gridFactor);
    editSetValue("year", fields[editIndex].year);
  });
  useEffect(() => {
    editSync();
  }, [editIndex]);

  return (
    <>
      <SSDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Add building type"
        description="Add building categories and sub-types"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormProvider
          handleSubmit={handleSubmit}
          control={control}
          reset={reset}
          setValue={setValue}
          formState={{ errors, ...formState }}
          {...methods}
        >
          <form
            id="view-grid-factor-form"
            className="flex flex-col h-full overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 p-2.5 bg-muted rounded-[0.5rem] border border-border">
                <div className="flex items-center gap-1.5">
                  {country && (
                    <CircleFlag countryCode={country} className="size-6" />
                  )}
                  <span className="label-small font-medium">
                    {countriesService.getOfficialName(country ?? "")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium text-(--text--strong-950)"
                  >
                    {status}
                  </Label>
                  <Switch
                    id="status"
                    checked={status === "Active"}
                    onCheckedChange={(c) =>
                      setValue("status", c ? "Active" : "Inactive")
                    }
                  />
                </div>
              </div>
              <div className="flex items-end gap-2 justify-between pt-5">
                <div>
                  <h6 className="text-base/6 font-bold">Grid Factors</h6>
                  <p className="text-sm/6">
                    Below are the grid factors that apply to Vietnam
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setAddNewGridFactor(true)}
                >
                  <Icon name="add-large-fill" size={20} />
                  Add Grid Factor
                </Button>
              </div>
              <ul className="grid grid-cols-1 gap-4">
                {fields.map((field, index) => (
                  <li
                    key={field.id}
                    className="pb-2.5 flex items-center justify-between border-b border-border"
                  >
                    <div className="flex items-center gap-1">
                      <Badge className="bg-muted h-7 rounded-[0.375rem] px-2 paragraph-small">
                        <span className="text-foreground font-bold">
                          Factor:
                        </span>
                        <span className="font-normal">
                          {field.gridFactor as number}
                        </span>
                      </Badge>
                      <Badge className="bg-muted paragraph-small text-foreground font-normal h-7 rounded-[0.375rem] px-2">
                        Year: <span className="font-normal">{field.year}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Field orientation="horizontal" className="w-fit">
                        <Switch
                          id={`status-${index}`}
                          checked={field.status === "Active"}
                          onCheckedChange={(c) => toggleStatus(index, c)}
                        />
                        <FieldLabel
                          htmlFor={`status-${index}`}
                          className="paragraph-small font-normal text-foreground"
                        >
                          {field.status}
                        </FieldLabel>
                      </Field>
                      <PopoverTrigger handle={handle} id={`edit-${index}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditIndex(index)}
                        >
                          <Icon name="edit-line" size={20} />
                        </Button>
                      </PopoverTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Icon name="delete-bin-5-line" size={20} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </FormProvider>
      </SSDialog>
      <AddSSDialog
        open={addNewGridFactor}
        onOpenChange={() => setAddNewGridFactor(false)}
        title="Add Grid Factor"
        description="Complete the fields below to add a grid factor"
        onSubmit={addHandleSubmit(addOnSubmit)}
        nextLabel="Add Grid Factor"
      >
        <div className="grid grid-cols-2 gap-3 p-5 pt-3.25 overflow-y-auto hide-scrollbar">
          <FormInput
            name="gridFactor"
            label="Country's grid emission factors"
            type="number"
            id="grid-factor"
            control={addControl}
            schema={addGridFactorSchema}
            step={0.001}
            placeholder="eg. 0.343"
          />
          <FormInput
            id="active-year"
            name="year"
            label="Year"
            type="number"
            min={1900}
            max={2100}
            required
            control={addControl}
            schema={addGridFactorSchema}
            placeholder="eg. 2026"
          />
          <FormSelect
            id="unit"
            name="unit"
            label="Unit of measure"
            schema={addGridFactorSchema}
            control={addControl}
            items={[{ item: "kgCO2e/kWh", value: "kgCO2e/kWh" }]}
            placeholder="Select a unit..."
            fieldClassName="col-span-2"
          />
          <Field
            orientation="horizontal"
            className="border border-border p-4 gap-2 col-span-2 rad-3 mt-1 items-start"
          >
            <div className="flex-1 space-y-1">
              <FieldLabel
                className="label-small font-medium cursor-pointer"
                htmlFor="set-active-factor"
              >
                Set as active factor immediately
              </FieldLabel>
              <p className="paragraph-x-small">
                Make this the active grid factor?
              </p>
            </div>
            <Checkbox
              id="set-active-factor"
              checked={addStatus === "Active"}
              onCheckedChange={(val) =>
                addSetValue("status", val ? "Active" : "Inactive")
              }
              className="data-checked:bg-(--blue--500) data-checked:text-white shadow-none"
            />
          </Field>
        </div>
      </AddSSDialog>

      <Popover
        open={editIndex !== -1}
        onOpenChange={(val) => {
          if (!val) {
            setEditIndex(-1);
          }
        }}
        modal={true}
        handle={handle}
      >
        <PopoverContent className="w-full max-w-91 p-0">
          <FormProvider
            handleSubmit={editHandleSubmit}
            control={editControl}
            reset={editReset}
            setValue={editSetValue}
            {...editMethods}
          >
            <form
              id="edit-grid-factor-form"
              className="flex flex-col h-full overflow-hidden"
              onSubmit={editHandleSubmit((data) => {
                const original = fields[editIndex];
                update(editIndex, {
                  ...original,
                  gridFactor: data.factor,
                  year: data.year,
                });
                handle.close();
              })}
            >
              <div className="size-full relative p-5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => handle.close()}
                >
                  <Icon
                    name="close-line"
                    size={20}
                    color="var(--icon--sub-600)"
                  />
                </Button>
                <h4 className="label-medium font-medium text-foreground">
                  Edit Grid Factor
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <FormInput
                    id="factor"
                    label="Factor"
                    type="number"
                    placeholder="Enter factor"
                    control={editControl}
                    schema={editSchema}
                    name="factor"
                    step="0.001"
                  />
                  <FormInput
                    id="year"
                    label="Year"
                    placeholder="Enter year"
                    control={editControl}
                    schema={editSchema}
                    name="year"
                  />
                </div>
              </div>
              <div className="w-full py-4 px-5 flex gap-3 border-t border-border">
                <Button
                  className="flex-1 h-9"
                  variant="outline"
                  onClick={() => handle.close()}
                >
                  Cancel
                </Button>
                <Button className="flex-1 h-9" type="submit">
                  Update
                </Button>
              </div>
            </form>
          </FormProvider>
        </PopoverContent>
      </Popover>
    </>
  );
};
