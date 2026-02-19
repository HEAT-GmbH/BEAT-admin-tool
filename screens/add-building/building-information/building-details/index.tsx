"use client";

import { useFormContext } from "react-hook-form";
import { AddBuildingForm, schema } from "../../schema";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";

export function BuildingDetailsScreen() {
  const { control } = useFormContext<AddBuildingForm>();

  return (
    <section className="grid grid-cols-2 gap-x-4.5 gap-y-2.25">
      <div className="col-span-2">
        <FormSelect
          name="buildingInformation.buildingDetails.type"
          id="building-type"
          label="Building type"
          placeholder="Select building type"
          control={control}
          schema={schema}
          items={[
            { item: "Office", value: "office" },
            { item: "Data Center", value: "data-center" },
            { item: "Retail", value: "retail" },
            { item: "Hotel", value: "hotel" },
            { item: "Hospital", value: "hospital" },
            { item: "School", value: "school" },
            { item: "Other", value: "other" },
          ]}
        />
      </div>
      <div className="col-span-2">
        <FormSelect
          name="buildingInformation.buildingDetails.areaClimateType"
          id="area-climate-type"
          label="Area climate type"
          placeholder="eg. Tropical wet"
          control={control}
          schema={schema}
          items={[
            { item: "Tropical wet", value: "tropical-wet" },
            { item: "Tropical dry", value: "tropical-dry" },
            { item: "Arid", value: "arid" },
            { item: "Temperate", value: "temperate" },
            { item: "Continental", value: "continental" },
            { item: "Polar", value: "polar" },
          ]}
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingDetails.assessmentPeriod"
          id="assessment-period"
          label="Assessment period (years)"
          placeholder="eg. 10"
          type="number"
          control={control}
          schema={schema}
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingDetails.constructionYear"
          id="construction-year"
          label="Construction year"
          placeholder="eg. 2023"
          control={control}
          schema={schema}
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingDetails.totalFloorArea"
          id="total-floor-area"
          label="Total floor area"
          labelAddon={
            <span className="text-(--text--soft-400) text-xs">(m²)</span>
          }
          placeholder="eg. 340"
          type="number"
          control={control}
          schema={schema}
          endAddon={
            <span className="text-(--text--soft-400) text-sm font-normal">
              m²
            </span>
          }
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingDetails.conditionedFloorArea"
          id="conditioned-floor-area"
          label="Conditioned floor area"
          labelAddon={
            <div className="flex items-center gap-1">
              <span className="text-(--text--soft-400) text-xs">(m²)</span>
              <Icon
                name="information-fill"
                className="text-(--icon--soft-400)"
                size={14}
              />
            </div>
          }
          placeholder="eg. 400"
          type="number"
          control={control}
          schema={schema}
          endAddon={
            <span className="text-(--text--soft-400) text-sm font-normal">
              m²
            </span>
          }
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingDetails.roomCoolingTemperature"
          id="room-cooling-temperature"
          label="Room cooling temperature"
          placeholder="eg. 10"
          type="number"
          control={control}
          schema={schema}
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingDetails.numberOfFloorsBelowGround"
          id="number-of-floors-below-ground"
          label="Number of floors below ground"
          placeholder="eg. 3"
          type="number"
          control={control}
          schema={schema}
        />
      </div>
      <div className="col-span-1">
        <FormInput
          name="buildingInformation.buildingDetails.energyConsumption"
          id="energy-consumption"
          label="Energy consumption of building"
          labelAddon={
            <span className="text-(--text--soft-400) text-xs">(%)</span>
          }
          placeholder="eg. 10"
          type="number"
          control={control}
          schema={schema}
          endAddon={
            <span className="text-(--text--soft-400) text-sm font-normal">
              %
            </span>
          }
        />
      </div>
      <div className="col-span-1">
        <FormSelect
          name="buildingInformation.buildingDetails.energyMonitoringControlSystems"
          id="energy-monitoring-control-systems"
          label="Energy monitoring & control systems"
          placeholder="eg. Yes"
          control={control}
          schema={schema}
          items={[
            { item: "Yes", value: "yes" },
            { item: "No", value: "no" },
          ]}
        />
      </div>
    </section>
  );
}
