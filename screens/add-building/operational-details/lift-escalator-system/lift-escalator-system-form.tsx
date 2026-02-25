"use client";

import { FormEndLabel } from "@/components/form-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import {
  LiftEscalatorSystem,
  liftEscalatorSystemSchema,
} from "@/screens/add-building/schema";
import { Control } from "react-hook-form";

type LiftEscalatorSystemFormProps = {
  control: Control<LiftEscalatorSystem>;
};

export function LiftEscalatorSystemForm({
  control,
}: LiftEscalatorSystemFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        fieldClassName="col-span-2"
        control={control}
        name="numberOfLifts"
        schema={liftEscalatorSystemSchema}
        id="num-lifts"
        label="Number of lifts"
        placeholder="eg. 5"
        type="number"
      />

      <FormSelect
        control={control}
        name="installationOfLiftRegenerativeFeatures"
        schema={liftEscalatorSystemSchema}
        id="regen"
        label="Installation of Lift regenerative Features"
        placeholder="Select an option"
        items={[
          { value: "true", item: "Yes" },
          { value: "false", item: "No" },
        ]}
      />

      <FormSelect
        control={control}
        name="installationOfVVVFAndSleepMode"
        schema={liftEscalatorSystemSchema}
        id="vvvf"
        label="Installation of VVVF and sleep mode"
        placeholder="Select an option"
        items={[
          { value: "true", item: "Yes" },
          { value: "false", item: "No" },
        ]}
      />

      <FormInput
        control={control}
        name="annualEnergyConsumption"
        schema={liftEscalatorSystemSchema}
        id="annual-energy"
        fieldClassName="col-span-2"
        label="Annual lift system energy consumption"
        placeholder="eg. 343"
        type="number"
        endAddon={<FormEndLabel label="kWh/year" />}
      />
    </div>
  );
}
