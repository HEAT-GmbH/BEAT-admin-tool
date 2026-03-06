"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { FuelEmissionFactor } from "@/models/fuel-emission-factor";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  type: z.string().min(1, "Type is required"),
  emissionFactor: z.number().min(0.001, "Emission factor is required"),
  unit: z.string().min(1, "Unit is required"),
  status: z.union([z.literal("Active"), z.literal("Inactive")]),
});

type ViewGridFactorData = z.infer<typeof schema>;

interface ViewGridFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FuelEmissionFactor | null;
}

export const ViewGridFactorDialog = ({
  open,
  onOpenChange,
  item,
}: ViewGridFactorDialogProps) => {
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors, ...formState },
    ...methods
  } = useForm({
    resolver: zodResolver(schema),
  });

  const status = useWatch({
    control,
    name: "status",
  });

  const onSubmit = (data: ViewGridFactorData) => {
    console.log("Submit building type:", data);
    onOpenChange(false);
    reset();
  };

  const sync = useEffectEvent(() => {
    if (!item) {
      reset();
      return;
    }

    setValue("type", item.type);
    setValue("emissionFactor", item.emissionFactor);
    setValue("unit", item.unit);
    setValue("status", item.status);
  });
  useEffect(() => {
    sync();
  }, [item]);

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item ? item.type + " fuel" : "Fuel type"}
      description="You can adjust the parameters in the input field to modify the fuel type"
      onSubmit={handleSubmit(onSubmit)}
      nextLabel="Update"
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
          id="view-fuel-factor-form"
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-wrap gap-4">
              <FormInput
                name="type"
                label="Fuel Type"
                id="fuel-type"
                control={control}
                schema={schema}
                placeholder="eg. Gasoline"
                fieldClassName="w-full"
              />
              <FormInput
                name="emissionFactor"
                label="Emission Factor value"
                type="number"
                id="emission-factor"
                control={control}
                schema={schema}
                placeholder="eg. 0.343"
                step={0.001}
                fieldClassName="flex-1"
              />
              <FormSelect
                id="unit"
                name="unit"
                label="Unit of measure"
                schema={schema}
                control={control}
                items={[{ item: "kgCO2e/kWh", value: "kgCO2e/kWh" }]}
                placeholder="Select a unit..."
                fieldClassName="flex-1"
              />
              <Field orientation="horizontal">
                <Switch
                  id="status"
                  checked={status === "Active"}
                  onCheckedChange={(c) =>
                    setValue("status", c ? "Active" : "Inactive")
                  }
                />
                <FieldLabel htmlFor="status" className="text-sm font-medium">
                  Status{" "}
                  <span className="text-(--text--sub-600)">{`(${status})`}</span>
                </FieldLabel>
              </Field>
            </div>
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
