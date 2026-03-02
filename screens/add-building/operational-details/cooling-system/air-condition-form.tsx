"use client";

import { DialogAccordion, DialogDivider } from "@/components/dialog-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { numberOfStarsOptions } from "@/constants/select-options";
import {
  AirConditionSystem,
  airConditionSystemSchema,
} from "@/screens/add-building/schema";
import { Control } from "react-hook-form";

type AirConditionFormProps = {
  control: Control<AirConditionSystem>;
};

export function AirConditionForm({ control }: AirConditionFormProps) {
  return (
    <div className="space-y-4 pt-4">
      <DialogDivider>Air Condition System Data</DialogDivider>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          control={control}
          name="data.type"
          schema={airConditionSystemSchema}
          id="ac-type"
          label="Type of air condition"
          placeholder="Select an option"
          items={[
            { value: "split", item: "Split air condition" },
            { value: "vrv", item: "Variable Refrigerant Volume (VRV)" },
          ]}
        />
        <FormInput
          control={control}
          name="data.yearOfInstallation"
          schema={airConditionSystemSchema}
          id="ac-year"
          label="Year of installation"
          placeholder="eg. 2012"
        />
        <FormSelect
          control={control}
          name="data.refrigerantType"
          schema={airConditionSystemSchema}
          id="ac-refrigerant"
          label="Type of refrigerants"
          placeholder="Select an option"
          items={[
            { value: "R-134A", item: "R-134A" },
            { value: "R-32", item: "R-32" },
            { value: "R-410A", item: "R-410A" },
          ]}
        />
        <FormInput
          control={control}
          name="data.refrigerantQuantity"
          schema={airConditionSystemSchema}
          id="ac-qty"
          label="Refrigerant quantity"
          placeholder="eg. 134"
          type="number"
          endAddon={<span className="text-sm text-gray-500">kg</span>}
        />
        <FormInput
          control={control}
          name="data.totalCoolingLoad"
          schema={airConditionSystemSchema}
          id="ac-load"
          label="Total cooling load"
          placeholder="eg. 342"
          type="number"
        />
      </div>
      <DialogAccordion>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="otherDetails.totalSplitVRVUnits"
            schema={airConditionSystemSchema}
            id="total-split-vrv-units"
            label="Total number of split/VRV units"
            placeholder="eg. 2"
            type="number"
          />
          <FormInput
            control={control}
            name="otherDetails.totalSplitVRVSystem"
            schema={airConditionSystemSchema}
            id="total-split-vrv-system"
            label="Total split unit//VRV system"
            placeholder="eg. 400"
            type="number"
            endAddon={<span className="text-sm text-gray-500">kW</span>}
          />
          <div className="col-span-2">
            <FormInput
              control={control}
              name="otherDetails.totalEnergyConsumptionAnnually"
              schema={airConditionSystemSchema}
              id="ac-total-energy-consumption"
              label="Total energy consumption of chiller system annually"
              placeholder="eg.200"
              type="number"
              endAddon={<span className="text-sm text-gray-500">kwh/year</span>}
            />
          </div>
          <div className="col-span-2">
            <FormInput
              control={control}
              name="otherDetails.baselineSplitVRVEfficiency"
              schema={airConditionSystemSchema}
              id="baseline-split-vrv-efficiency"
              label="Baseline split unit/VRV system efficiency"
              placeholder="333"
              type="number"
              endAddon={<span className="text-sm text-gray-500">Watt</span>}
            />
          </div>
          <FormInput
            control={control}
            name="otherDetails.iseerRating"
            schema={airConditionSystemSchema}
            id="iseer-rating"
            label="ISEER rating"
            placeholder="eg. 4.5"
            type="number"
            step={0.01}
          />
          <FormInput
            control={control}
            name="otherDetails.cop"
            schema={airConditionSystemSchema}
            id="ac-cop"
            label="COP"
            placeholder="eg. 2"
            type="number"
          />
          <FormSelect
            control={control}
            name="otherDetails.energyEfficiencyLabel"
            schema={airConditionSystemSchema}
            id="ac-efficiency-label"
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
            schema={airConditionSystemSchema}
            id="ac-stars"
            label="Number of stars"
            placeholder="Select an option"
            items={numberOfStarsOptions}
          />
        </div>
      </DialogAccordion>
    </div>
  );
}
