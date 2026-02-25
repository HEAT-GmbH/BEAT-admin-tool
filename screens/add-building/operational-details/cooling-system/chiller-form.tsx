"use client";

import { DialogAccordion, DialogDivider } from "@/components/dialog-addons";
import { FormEndLabel } from "@/components/form-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { YesNoRadio } from "@/components/yes-no-radio";
import { numberOfStarsOptions } from "@/constants/select-options";
import {
  ChillerSystem,
  chillerSystemSchema,
} from "@/screens/add-building/schema";
import { Control } from "react-hook-form";

type ChillerFormProps = {
  control: Control<ChillerSystem>;
};

export function ChillerForm({ control }: ChillerFormProps) {
  return (
    <div className="space-y-4 pt-4">
      <DialogDivider>Chiller System Data</DialogDivider>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          control={control}
          name="data.type"
          schema={chillerSystemSchema}
          id="chiller-type"
          label="Chiller system"
          placeholder="Select an option"
          items={[
            { value: "water-cooled", item: "Water cooled chiller" },
            { value: "air-cooled", item: "Air cooled chiller" },
          ]}
        />
        <FormInput
          control={control}
          name="data.yearOfInstallation"
          schema={chillerSystemSchema}
          id="year-intallation"
          label="Year of installation"
          placeholder="eg. 2012"
        />
        <FormSelect
          control={control}
          name="data.refrigerantType"
          schema={chillerSystemSchema}
          id="refrigerant-type"
          label="Type of refrigerants"
          placeholder="Select an option"
          items={[
            { value: "R-134A", item: "R-134A" },
            { value: "R-32", item: "R-32" },
            { value: "R-410A", item: "R-410A" },
            { value: "R-290", item: "R-290 (Propane)" },
          ]}
        />
        <FormInput
          control={control}
          name="data.refrigerantQuantity"
          schema={chillerSystemSchema}
          id="refrigerant-qty"
          label="Refrigerant quantity"
          placeholder="eg. 134"
          type="number"
          endAddon={<span className="text-sm text-gray-500">kg</span>}
        />
        <YesNoRadio
          control={control}
          name="data.installationOfVariableSpeedDrives"
          schema={chillerSystemSchema}
          id="installation-of-variable-speed-drives"
          label="Installation of variable speed drives"
        />
        <YesNoRadio
          control={control}
          name="data.installationOfHeatRecoverySystems"
          schema={chillerSystemSchema}
          id="installation-of-heat-recovery-systems"
          label="Installation of heat recovery systems"
        />
        <FormInput
          control={control}
          name="data.totalCoolingLoad"
          schema={chillerSystemSchema}
          id="total-cooling-load"
          label="Total cooling load"
          placeholder="eg. 342"
          type="number"
        />
        <FormInput
          control={control}
          name="data.baselineCoolingEfficiency"
          schema={chillerSystemSchema}
          id="baseline-cooling-efficiency"
          label="Baseline Cooling Efficiency"
          placeholder="eg. 2"
          type="number"
        />
      </div>
      <DialogAccordion>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="otherDetails.numberOfChillers"
            schema={chillerSystemSchema}
            id="number-of-chillers"
            label="Number of chillers (Optional)"
            placeholder="eg. 2"
            type="number"
          />
          <FormInput
            control={control}
            name="otherDetails.totalChillerSystemPowerInput"
            schema={chillerSystemSchema}
            id="total-chiller-system-power-input"
            label="Total chiller system power input"
            placeholder="eg.2000"
            type="number"
            endAddon={<span className="text-sm text-gray-500">kwH</span>}
          />
          <div className="col-span-2">
            <FormInput
              control={control}
              name="otherDetails.waterCooledChillerCoolingLoadFactor"
              schema={chillerSystemSchema}
              id="water-cooled-chiller-cooling-load-factor"
              label="Water-cooled chiller cooling load factor (Optional) %"
              placeholder="45"
              type="number"
              endAddon={<span className="text-sm text-gray-500">%</span>}
            />
          </div>
          <FormInput
            control={control}
            name="otherDetails.cop"
            schema={chillerSystemSchema}
            id="chiller-cop"
            label="COP"
            placeholder="eg. 2"
            type="number"
          />
          <FormInput
            control={control}
            name="otherDetails.iplv"
            schema={chillerSystemSchema}
            id="chiller-iplv"
            label="IPLV"
            placeholder="eg. 2"
            type="number"
          />
          <FormSelect
            control={control}
            name="otherDetails.energyEfficiencyLabel"
            schema={chillerSystemSchema}
            id="chiller-efficiency-label"
            label="Energy efficiency label"
            placeholder="Select efficiency label"
            items={[
              { value: "bee", item: "BEE Star Rating" },
              { value: "egat", item: "EGAT" },
              { value: "nea", item: "NEA Tick Rating" },
            ]}
          />
          <FormSelect
            control={control}
            name="otherDetails.numberOfStars"
            schema={chillerSystemSchema}
            id="chiller-stars"
            label="Number of stars"
            placeholder="Select an option"
            items={numberOfStarsOptions}
          />
          <div className="col-span-2">
            <FormInput
              control={control}
              name="otherDetails.totalEnergyConsumptionAnnually"
              schema={chillerSystemSchema}
              id="total-energy-consumption-annually"
              label="Total energy consumption of chiller system annually (kwh/year)"
              placeholder="eg. 200"
              type="number"
              endAddon={<FormEndLabel label="kwh/year" />}
            />
          </div>
        </div>
      </DialogAccordion>
    </div>
  );
}
