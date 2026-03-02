"use client";

import { FormEndLabel } from "@/components/form-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { numberOfStarsOptions } from "@/constants/select-options";
import { hotWaterSystemSchema } from "@/screens/add-building/schema";

type HotWaterSystemFormProps = {
  control: any;
};

export function HotWaterSystemForm({ control }: HotWaterSystemFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormSelect
        control={control}
        name="type"
        schema={hotWaterSystemSchema}
        id="hw-type"
        label="Type of hot water system"
        placeholder="Select an option"
        items={[
          { value: "heat-pump", item: "Heat pump water heater" },
          { value: "boiler", item: "Boiler" },
          { value: "solar", item: "Solar water heaters" },
        ]}
      />

      <FormSelect
        control={control}
        name="fuelType"
        schema={hotWaterSystemSchema}
        id="fuel-type"
        label="Fuel type"
        placeholder="Select an option"
        items={[
          { value: "electricity", item: "Electricity" },
          { value: "light-fuel-oil", item: "Light fuel oil" },
          { value: "heavy-fuel-oil", item: "Heavy fuel oil" },
          { value: "lpg", item: "Liquified petroleum gas (LPG)" },
          { value: "natural-gas", item: "Natural gas" },
          { value: "coal", item: "Coal" },
          { value: "ignite", item: "Ignite" },
          { value: "diesel", item: "Diesel" },
        ]}
      />

      <Field className="fieldset col-span-2 border-none p-0">
        <FieldLabel className="fieldset-legend text-sm font-medium mb-2 flex items-center gap-1">
          System operating schedule
          <Icon
            name="info-custom-fill"
            size={20}
            color="var(--icon--disabled-300)"
          />
        </FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          <FormInput
            control={control}
            name="systemOperatingSchedule.hours"
            schema={hotWaterSystemSchema}
            id="op-hours"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="Hours / day" />}
          />
          <FormInput
            control={control}
            name="systemOperatingSchedule.days"
            schema={hotWaterSystemSchema}
            id="op-days"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="days / week" />}
          />
          <FormInput
            control={control}
            name="systemOperatingSchedule.weeks"
            schema={hotWaterSystemSchema}
            id="op-weeks"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="weeks / year" />}
          />
        </div>
      </Field>

      <FormInput
        control={control}
        name="fuelConsumption"
        schema={hotWaterSystemSchema}
        id="fuel-consumption"
        label="Fuel consumption"
        placeholder="eg. 343"
        type="number"
        endAddon={<span className="text-sm text-gray-500">Litres/m³</span>}
      />

      <FormInput
        control={control}
        name="powerInput"
        schema={hotWaterSystemSchema}
        id="power-input"
        label="Hot water system power input"
        placeholder="eg. 343"
        type="number"
        endAddon={<FormEndLabel label="Kw" />}
      />
      <FormInput
        fieldClassName="col-span-2"
        control={control}
        name="baselineEfficiency"
        schema={hotWaterSystemSchema}
        id="baseline-efficiency"
        label="Baseline hot water system efficiency"
        placeholder="eg. 343"
        type="number"
      />

      <FormInput
        fieldClassName="col-span-2"
        control={control}
        name="baselineEquipmentEfficiencyLevel"
        schema={hotWaterSystemSchema}
        id="baseline-equip-efficiency"
        label="Baseline hot water system equipment efficiency level"
        placeholder="eg. 40"
        type="number"
        endAddon={<span className="text-sm text-gray-500">%</span>}
      />

      <FormSelect
        control={control}
        name="installationOfHeatRecoverySystem"
        schema={hotWaterSystemSchema}
        id="heat-recovery"
        label="Installation of heat recovery system"
        placeholder="Select an option"
        items={[
          { value: "true", item: "Yes" },
          { value: "false", item: "No" },
        ]}
      />

      <FormInput
        control={control}
        name="numberOfEquipment"
        schema={hotWaterSystemSchema}
        id="num-equip"
        label="Number of hot water equipment"
        placeholder="eg. 5"
        type="number"
      />

      <FormSelect
        control={control}
        name="energyEfficiencyLabel"
        schema={hotWaterSystemSchema}
        id="efficiency-label"
        label="Energy efficiency label"
        placeholder="Select an option"
        items={[
          { value: "bee", item: "BEE Star Rating" },
          { value: "egat", item: "EGAT" },
        ]}
      />

      <FormSelect
        control={control}
        name="numberOfStars"
        schema={hotWaterSystemSchema}
        id="stars"
        label="Number of stars"
        placeholder="Select an option"
        items={numberOfStarsOptions}
      />
    </div>
  );
}
