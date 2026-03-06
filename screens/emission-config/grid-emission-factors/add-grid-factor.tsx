"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";
import { SSDialog } from "@/screens/components/dialog";
import { countriesService } from "@/services/countries.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleFlag } from "react-circle-flags";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  country: z.string().min(1, "Country is required"),
  gridFactor: z.object({
    year: z.string().min(1, "Year is required"),
    gridFactor: z.coerce.number().min(1, "Grid factor is required"),
    unit: z.string().min(1, "Unit of measure is required"),
    status: z.union([z.literal("Active"), z.literal("Inactive")]),
  }),
});

type AddGridFactorData = z.infer<typeof schema>;

interface AddGridFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddGridFactorDialog = ({
  open,
  onOpenChange,
}: AddGridFactorDialogProps) => {
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
  const country = useWatch({
    control,
    name: "country",
  });

  const onSubmit = (data: AddGridFactorData) => {
    console.log("Submit grid factor:", data);
    onOpenChange(false);
    reset();
  };

  return (
    <SSDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add grid factor"
      description="Create a country grid factor."
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
          id="add-grid-factor-form"
          className="flex flex-col h-full overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <Field>
              <FieldLabel>Emission Country</FieldLabel>
              <VirtualizedCombobox
                placeholder="Select a country..."
                options={[
                  {
                    label: "Select a country...",
                    value: "",
                    icon: <Icon name="global-line" size={20} />,
                  },
                  ...(!countriesService.hasCountries()
                    ? []
                    : countriesService.getCountries()?.map((country) => ({
                        label: country.name,
                        value: country.code,
                        icon: (
                          <CircleFlag
                            countryCode={country.code}
                            className="size-5"
                          />
                        ),
                      }))),
                ]}
                value={country}
                onValueChange={(value) => setValue("country", value ?? "")}
              />
            </Field>
            {!!country && (
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  name="gridFactor.gridFactor"
                  label="Country's grid emission factors"
                  type="number"
                  id="grid-factor"
                  control={control}
                  schema={schema}
                  step={0.001}
                  placeholder="eg. 0.343"
                />
                <FormInput
                  id="active-year"
                  name="gridFactor.year"
                  label="Year"
                  type="number"
                  min={1900}
                  max={2100}
                  required
                  control={control}
                  schema={schema}
                  placeholder="eg. 2026"
                />
                <FormSelect
                  id="unit"
                  name="gridFactor.unit"
                  label="Unit of measure"
                  schema={schema}
                  control={control}
                  items={[{ item: "kgCO2e/kWh", value: "kgCO2e/kWh" }]}
                  placeholder="Select a unit..."
                  fieldClassName="col-span-2"
                />
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </SSDialog>
  );
};
