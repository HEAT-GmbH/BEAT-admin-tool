"use client";

import { FormEndLabel, FormEndSelect } from "@/components/form-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { YesNoRadio } from "@/components/yes-no-radio";
import { numberOfStarsOptions } from "@/constants/select-options";
import {
  VentilationSystem,
  ventilationSystemSchema,
} from "@/screens/add-building/schema";
import { Control } from "react-hook-form";

type VentilationSystemFormProps = {
  control: Control<VentilationSystem>;
};

export function VentilationSystemForm({ control }: VentilationSystemFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormSelect
        control={control}
        name="type"
        schema={ventilationSystemSchema}
        id="vent-type"
        label="Ventilation type"
        placeholder="Select an option"
        items={[
          { value: "ahu", item: "Air Handling Units (AHUs)" },
          { value: "fcu", item: "Fan coil units (FCUs)" },
          {
            value: "ceiling-wall-ac",
            item: "Ceiling or wall mounted cassette ACs",
          },
          { value: "doas", item: "DOAS" },
          {
            value: "celling-exhaust-wall-fan",
            item: "Celing/Exhaust/Wall Fan",
          },
          { value: "other", item: "Other ventilation type" },
        ]}
      />
      <FormSelect
        control={control}
        name="capacityUnit"
        schema={ventilationSystemSchema}
        id="vent-capacity"
        label="Ventilation capacity"
        placeholder="Select an option"
        items={[
          {
            value: "m3-hr",
            item: (
              <span>
                m<sup>3</sup>/hr
              </span>
            ),
          },
          {
            value: "ft3-min",
            item: (
              <span>
                ft<sup>3</sup>/min
              </span>
            ),
          },
        ]}
      />

      <div className="col-span-2">
        <FormInput
          control={control}
          name="baselineEfficiency"
          schema={ventilationSystemSchema}
          id="baseline-efficiency"
          placeholder="eg. 2"
          type="number"
          label="Baseline verification system efficiency"
          endAddon={<FormEndLabel label="W/CMH" />}
        />
      </div>

      <Field className="col-span-2">
        <FieldLabel className="label-small flex items-center gap-1">
          System operating schedule
          <Icon
            name="info-custom-fill"
            size={20}
            className="text-(--icon--disabled-300)"
          />
        </FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          <FormInput
            control={control}
            name="systemOperatingSchedule.hours"
            schema={ventilationSystemSchema}
            id="op-hours"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="Hours / day" />}
          />
          <FormInput
            control={control}
            name="systemOperatingSchedule.days"
            schema={ventilationSystemSchema}
            id="op-days"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="days / week" />}
          />
          <FormInput
            control={control}
            name="systemOperatingSchedule.weeks"
            schema={ventilationSystemSchema}
            id="op-weeks"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="weeks / year" />}
          />
        </div>
      </Field>

      <FormInput
        control={control}
        name="totalPowerInput"
        schema={ventilationSystemSchema}
        id="power-input"
        placeholder="eg. 2"
        label="Total ventilation system power input"
        type="number"
        endAddon={<FormEndLabel label="Watts" />}
      />

      <FormInput
        control={control}
        name="airFlowRate"
        schema={ventilationSystemSchema}
        id="airflow-rate"
        label="Airflow rate"
        placeholder="eg. 2"
        type="number"
        endAddon={
          <FormEndSelect
            options={["CMH", "CFM"].map((i) => ({ value: i, label: i }))}
          />
        }
      />

      <div className="col-span-2">
        <YesNoRadio
          control={control}
          name="installationOfDemandControlledVentilation"
          schema={ventilationSystemSchema}
          id="demand-controlled-ventilation"
          label="Installation of Demand Controlled Ventilation"
        />
      </div>

      <FormSelect
        control={control}
        name="installationOfVariableSpeedDrives"
        schema={ventilationSystemSchema}
        id="var-speed-drives"
        label="Installation of variable speed drives"
        labelAddon={
          <Icon
            name="info-custom-fill"
            size={20}
            className="text-(--icon--disabled-300)"
          />
        }
        labelContainerClassName="justify-start"
        placeholder="Select an option"
        items={[
          { value: "true", item: "Yes" },
          { value: "false", item: "No" },
        ]}
      />

      <FormInput
        control={control}
        name="totalNumberOfVentilationTypeInstalled"
        schema={ventilationSystemSchema}
        id="total-installed"
        placeholder="eg. 2"
        label="Total number of ventilation type installed"
        type="number"
      />

      <div className="col-span-2">
        <FormInput
          control={control}
          name="totalEnergyConsumptionAnnually"
          schema={ventilationSystemSchema}
          id="annual-energy"
          placeholder="eg. 2"
          label="Total energy consumption of ventilation system annually"
          type="number"
          endAddon={<FormEndLabel label="kWh/year" />}
        />
      </div>

      <FormSelect
        control={control}
        name="energyEfficiencyLabel"
        schema={ventilationSystemSchema}
        id="efficiency-label"
        label="Energy efficiency label"
        placeholder="Select an option"
        items={[
          { value: "A", item: "A" },
          { value: "B", item: "B" },
          { value: "C", item: "C" },
          { value: "D", item: "D" },
          { value: "E", item: "E" },
          { value: "F", item: "F" },
          { value: "G", item: "G" },
        ]}
      />

      <FormSelect
        control={control}
        name="numberOfStars"
        schema={ventilationSystemSchema}
        id="stars"
        label="Number of stars"
        placeholder="Select an option"
        items={numberOfStarsOptions}
      />
    </div>
  );
}
