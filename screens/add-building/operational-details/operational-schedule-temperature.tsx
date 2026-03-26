"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { useFormContext } from "react-hook-form";
import { schema } from "../schema";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormEndLabel, FormEndSelect } from "@/components/form-addons";
import { temperatureOptions } from "@/constants/select-options";
import { Controller } from "react-hook-form";

export function OperationalScheduleTemperatureScreen() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormInput
        control={control}
        name="operationalDetails.operationalScheduleTemperature.numberOfResidents"
        schema={schema}
        id="number-of-residents"
        label="Number of residents (occupants)"
        placeholder="eg. 10"
        type="number"
        fieldRequired
      />

      <Field>
        <FieldLabel className="label-small text-foreground flex items-center gap-1">
          <span className="inline-flex gap-0.5">
            Annual operating schedule<span className="text-error">*</span>
          </span>
          <Icon
            name="info-custom-fill"
            size={20}
            className="text-[var(--icon--disabled-300)]"
          />
        </FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormInput
            control={control}
            name="operationalDetails.operationalScheduleTemperature.annualOperatingSchedule.hours"
            schema={schema}
            id="annual-operating-hours"
            placeholder="eg. 1"
            type="number"
            fieldRequired
            endAddon={<FormEndLabel label="Hours / day" />}
          />
          <FormInput
            control={control}
            name="operationalDetails.operationalScheduleTemperature.annualOperatingSchedule.days"
            schema={schema}
            id="annual-operating-days"
            placeholder="eg. 1"
            type="number"
            fieldRequired
            endAddon={<FormEndLabel label="Days / week" />}
          />
          <FormInput
            control={control}
            name="operationalDetails.operationalScheduleTemperature.annualOperatingSchedule.weeks"
            schema={schema}
            id="annual-operating-weeks"
            placeholder="eg. 1"
            type="number"
            fieldRequired
            endAddon={<FormEndLabel label="Weeks / year" />}
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="operationalDetails.operationalScheduleTemperature.heatingTemperatureUnit"
          defaultValue="celsius"
          render={({ field: unitField }) => (
            <FormInput
              control={control}
              name="operationalDetails.operationalScheduleTemperature.roomHeatingTemperature"
              schema={schema}
              id="room-heating-temperature"
              label="Room heating temperature"
              placeholder="eg. 18"
              type="number"
              fieldRequired
              endAddon={
                <FormEndSelect
                  options={temperatureOptions}
                  placeholder="Select"
                  value={unitField.value}
                  onChange={unitField.onChange}
                />
              }
            />
          )}
        />
        <Controller
          control={control}
          name="operationalDetails.operationalScheduleTemperature.coolingTemperatureUnit"
          defaultValue="celsius"
          render={({ field: unitField }) => (
            <FormInput
              control={control}
              name="operationalDetails.operationalScheduleTemperature.roomCoolingTemperature"
              schema={schema}
              id="room-cooling-temperature"
              label="Room cooling temperature"
              placeholder="eg. 32"
              type="number"
              fieldRequired
              endAddon={
                <FormEndSelect
                  options={temperatureOptions}
                  placeholder="Select"
                  value={unitField.value}
                  onChange={unitField.onChange}
                />
              }
            />
          )}
        />
      </div>

      <FormInput
        control={control}
        name="operationalDetails.operationalScheduleTemperature.renewableEnergyPercent"
        schema={schema}
        id="renewable-energy-percent"
        label="Renewable energy installation (%)"
        placeholder="eg. 10"
        type="number"
        endAddon={
          <span className="text-(--text--soft-400) text-sm font-normal">%</span>
        }
      />

      <FormSelect
        control={control}
        name="operationalDetails.operationalScheduleTemperature.buildingSmartSystem"
        schema={schema}
        id="building-smart-system"
        label="Building smart system installation"
        placeholder="Select"
        items={[
          { item: "Yes", value: "yes" },
          { item: "No", value: "no" },
        ]}
      />
    </div>
  );
}
