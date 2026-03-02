"use client";

import { FormEndLabel } from "@/components/form-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { numberOfStarsOptions } from "@/constants/select-options";
import {
  LightingSystem,
  lightingSystemSchema,
} from "@/screens/add-building/schema";
import { Control } from "react-hook-form";

type LightingSystemFormProps = {
  control: Control<LightingSystem>;
};

export function LightingSystemForm({ control }: LightingSystemFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormSelect
          control={control}
          name="type"
          schema={lightingSystemSchema}
          id="room-type"
          label="Room type"
          placeholder="Select an option"
          items={[
            {
              value: "office",
              item: (
                <span>
                  Office:{" "}
                  <span className="text-gray-500">
                    Conference Room, Lobby, Office
                  </span>
                </span>
              ),
            },
            {
              value: "hospital",
              item: (
                <span>
                  Hospital:{" "}
                  <span className="text-gray-500">
                    Patient Room, Waiting Room, Surgery Room
                  </span>
                </span>
              ),
            },
            {
              value: "residential",
              item: (
                <span>
                  Residential:{" "}
                  <span className="text-gray-500">
                    Kitchen, Dining, Bedroom, Bathroom
                  </span>
                </span>
              ),
            },
          ]}
        />
      </div>

      <FormInput
        control={control}
        name="roomArea"
        schema={lightingSystemSchema}
        id="room-area"
        label="Area of room"
        placeholder="eg. 2"
        type="number"
        endAddon={<FormEndLabel label="m²" />}
      />

      <FormSelect
        control={control}
        name="lightBulbType"
        schema={lightingSystemSchema}
        id="bulb-type"
        label="Light bulb type"
        placeholder="Select an option"
        items={[
          { value: "led", item: "LED" },
          { value: "cfl", item: "CFL" },
          { value: "halogen", item: "Halogen" },
          { value: "incandescent", item: "Incandescent" },
        ]}
      />

      <FormInput
        control={control}
        name="numberOfLightingBulbs"
        schema={lightingSystemSchema}
        id="num-bulbs"
        label="Number of lighting bulb"
        placeholder="eg. 2"
        type="number"
      />

      <FormInput
        control={control}
        name="lightingBulbPowerRating"
        schema={lightingSystemSchema}
        id="bulb-power"
        label="Light bulb power rating"
        placeholder="eg. 2"
        type="number"
        endAddon={<FormEndLabel label="W" />}
      />

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
            schema={lightingSystemSchema}
            id="op-hours"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="Hours / day" />}
          />
          <FormInput
            control={control}
            name="systemOperatingSchedule.days"
            schema={lightingSystemSchema}
            id="op-days"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="days / week" />}
          />
          <FormInput
            control={control}
            name="systemOperatingSchedule.weeks"
            schema={lightingSystemSchema}
            id="op-weeks"
            placeholder="eg. 1"
            type="number"
            endAddon={<FormEndLabel label="weeks / year" />}
          />
        </div>
      </Field>

      <FormSelect
        control={control}
        name="installationOfSensors"
        schema={lightingSystemSchema}
        id="sensors"
        label="Installation of sensors"
        placeholder="Select an option"
        labelAddon={
          <Icon
            name="info-custom-fill"
            size={20}
            className="text-(--icon--disabled-300)"
          />
        }
        labelContainerClassName="justify-start"
        items={[
          { value: "true", item: "Yes" },
          { value: "false", item: "No" },
        ]}
      />

      <FormInput
        control={control}
        name="baselineLightingPowerDensity"
        schema={lightingSystemSchema}
        id="lpd"
        label="Baseline Lighting Power Density (LPD)"
        placeholder="eg. 2"
        type="number"
        endAddon={<FormEndLabel label="W/m²" />}
      />

      <FormInput
        fieldClassName="col-span-2"
        control={control}
        name="totalEnergyConsumptionAnnually"
        schema={lightingSystemSchema}
        id="annual-energy"
        label="Total energy consumption of ventilation system annually"
        placeholder="eg. 2"
        type="number"
        endAddon={<FormEndLabel label="kWh/year" />}
      />

      <FormSelect
        control={control}
        name="energyEfficiencyLabel"
        schema={lightingSystemSchema}
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
        schema={lightingSystemSchema}
        id="stars"
        label="Number of stars"
        placeholder="Select an option"
        items={numberOfStarsOptions}
      />
    </div>
  );
}
