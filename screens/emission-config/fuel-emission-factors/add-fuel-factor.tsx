"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { SSDialog } from "@/screens/components/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  type: z.string().min(1, "Type is required"),
  emissionFactor: z.number().min(0.001, "Emission factor is required"),
  unit: z.string().min(1, "Unit is required"),
});

type AddFuelFactorData = z.infer<typeof schema>;

interface AddFuelFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddFuelFactorDialog = ({
  open,
  onOpenChange,
}: AddFuelFactorDialogProps) => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, ...formState },
    ...methods
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: AddFuelFactorData) => {
    console.log("Submit fuel factor:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Fuel Type"
      description="Add a new fuel type to the list"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider
        handleSubmit={handleSubmit}
        control={control}
        reset={reset}
        formState={{ errors, ...formState }}
        {...methods}
      >
        <form
          id="add-fuel-factor-form"
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
            </div>
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
