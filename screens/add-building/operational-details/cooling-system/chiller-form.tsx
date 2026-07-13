"use client";

import { DialogAccordion, DialogDivider } from "@/components/dialog-addons";
import { FormEndLabel } from "@/components/form-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { YesNoRadio } from "@/components/yes-no-radio";
import { ChillerSystem, chillerSystemSchema } from "@/screens/add-building/schema";
import { useQuery } from "@tanstack/react-query";
import { Control, useWatch } from "react-hook-form";

type ChillerFormProps = {
  control: Control<ChillerSystem>;
};

const CHILLER_TYPE_ITEMS = [
  { value: "water-cooled", item: "Water cooled chiller" },
  { value: "air-cooled", item: "Air cooled chiller" },
];

const ENERGY_LABEL_ITEMS = [
  { value: "A", item: "A" },
  { value: "B", item: "B" },
  { value: "C", item: "C" },
  { value: "D", item: "D" },
  { value: "E", item: "E" },
  { value: "F", item: "F" },
  { value: "G", item: "G" },
];

const STARS_ITEMS = ["1", "2", "3", "4", "5"].map((v) => ({ value: v, item: v }));

export function ChillerForm({ control }: ChillerFormProps) {
  const [
    totalCoolingLoad,
    numberOfChillers,
    baselineCoolingEfficiency,
    hours,
    days,
    weeks,
    vsd,
    hr,
  ] = useWatch({
    control,
    name: [
      "totalCoolingLoad",
      "numberOfChillers",
      "baselineCoolingEfficiency",
      "operatingSchedule.hours",
      "operatingSchedule.days",
      "operatingSchedule.weeks",
      "installationOfVariableSpeedDrives",
      "installationOfHeatRecoverySystems",
    ],
  });

  const autoEnergy = (() => {
    const load = Number(totalCoolingLoad) || 0;
    const units = Number(numberOfChillers) || 0;
    const eff = Number(baselineCoolingEfficiency) || 0;
    const h = Number(hours) || 0;
    const d = Number(days) || 0;
    const w = Number(weeks) || 0;
    if (!load || !units || !eff || !h || !d || !w) return "";
    const vsdFactor = vsd ? 0.80 : 1.00;
    const hrFactor = hr ? 0.70 : 1.00;
    return (load * units * eff * h * d * w * vsdFactor * hrFactor).toFixed(3);
  })();

  const { data: refrigerantData } = useQuery({
    queryKey: ["select-lists", "refrigerant_types"],
    queryFn: async () => {
      const res = await fetch("/api/system-settings/select-lists?type=refrigerant_types");
      if (!res.ok) throw new Error("Failed to fetch refrigerant types");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  const refrigerantItems = (refrigerantData?.results ?? []).map(
    (r: { id: string; name: string }) => ({ value: r.id, item: r.name })
  );

  return (
    <div className="space-y-4 pt-4">
      <DialogDivider>Water / Air Cooled Chiller Data</DialogDivider>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          control={control}
          name="chillerType"
          schema={chillerSystemSchema}
          id="chiller-type"
          label="Chiller system"
          placeholder="Select an option"
          items={CHILLER_TYPE_ITEMS}
          fieldRequired
        />
        <FormInput
          control={control}
          name="yearOfInstallation"
          schema={chillerSystemSchema}
          id="chiller-year"
          label="Year of installation"
          placeholder="e.g. 2019"
          type="number"
          fieldRequired
        />
        <FormSelect
          control={control}
          name="refrigerantType"
          schema={chillerSystemSchema}
          id="chiller-refrigerant"
          label="Type of refrigerants"
          placeholder="Select an option"
          items={refrigerantItems}
          fieldRequired
        />
        <FormInput
          control={control}
          name="refrigerantQuantity"
          schema={chillerSystemSchema}
          id="chiller-refrigerant-qty"
          label="Refrigerant quantity"
          placeholder="e.g. 200 – 2000 kg"
          type="number"
          endAddon={<FormEndLabel label="kg" />}
          fieldRequired
        />
        <FormInput
          control={control}
          name="totalCoolingLoad"
          schema={chillerSystemSchema}
          id="chiller-cooling-load"
          label="Total cooling load"
          placeholder="e.g. 500"
          type="number"
          endAddon={<FormEndLabel label="RT" />}
          fieldRequired
        />
        <FormInput
          control={control}
          name="numberOfChillers"
          schema={chillerSystemSchema}
          id="chiller-number"
          label="Number of units"
          placeholder="e.g. 2"
          type="number"
          fieldRequired
        />
        <FormInput
          control={control}
          name="baselineLeakageFactor"
          schema={chillerSystemSchema}
          id="chiller-leakage"
          label="Baseline leakage factor"
          placeholder="2 (new) or 10 (old)"
          type="number"
          endAddon={<FormEndLabel label="%" />}
          fieldRequired
        />
        <div className="col-span-2">
          <FormInput
            control={control}
            name="baselineCoolingEfficiency"
            schema={chillerSystemSchema}
            id="chiller-efficiency"
            label="Baseline cooling efficiency"
            placeholder="e.g. 0.70"
            type="number"
            endAddon={<FormEndLabel label="kW/RT" />}
            fieldRequired
          />
        </div>

        {/* Annual operating schedule */}
        <div className="col-span-2 space-y-1">
          <p className="label-small text-foreground flex items-center gap-0.5">
            Annual operating schedule<span className="text-error">*</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <FormInput
              control={control}
              name="operatingSchedule.hours"
              schema={chillerSystemSchema}
              id="chiller-hours"
              placeholder="e.g. 12"
              type="number"
              endAddon={<FormEndLabel label="Hours / day" />}
            />
            <FormInput
              control={control}
              name="operatingSchedule.days"
              schema={chillerSystemSchema}
              id="chiller-days"
              placeholder="e.g. 7"
              type="number"
              endAddon={<FormEndLabel label="Days / week" />}
            />
            <FormInput
              control={control}
              name="operatingSchedule.weeks"
              schema={chillerSystemSchema}
              id="chiller-weeks"
              placeholder="e.g. 52"
              type="number"
              endAddon={<FormEndLabel label="Weeks / year" />}
            />
          </div>
        </div>

        <YesNoRadio
          control={control}
          name="installationOfVariableSpeedDrives"
          schema={chillerSystemSchema}
          id="chiller-vsd"
          label="Installation of variable speed drives"
        />
        <YesNoRadio
          control={control}
          name="installationOfHeatRecoverySystems"
          schema={chillerSystemSchema}
          id="chiller-hr"
          label="Installation of heat recovery systems"
        />
      </div>

      <DialogAccordion>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormInput
              control={control}
              name="iplv"
              schema={chillerSystemSchema}
              id="chiller-iplv"
              label="IPLV (Integrated Part Load Value) — Optional"
              placeholder="e.g. 6.0"
              type="number"
            />
          </div>
          <div className="col-span-2">
            <FormInput
              control={control}
              name="waterCooledChillerCoolingLoadFactor"
              schema={chillerSystemSchema}
              id="chiller-wcclf"
              label="Water-cooled chiller cooling load factor — Optional (%)"
              placeholder="e.g. 15"
              type="number"
              endAddon={<FormEndLabel label="%" />}
            />
          </div>
          <FormInput
            control={control}
            name="totalChillerSystemPowerInput"
            schema={chillerSystemSchema}
            id="chiller-power-input"
            label="Total system power input — Optional"
            placeholder="e.g. 2000"
            type="number"
            endAddon={<FormEndLabel label="kW" />}
          />
          <FormInput
            control={control}
            name="cop"
            schema={chillerSystemSchema}
            id="chiller-cop"
            label="COP — Optional"
            placeholder="e.g. 5.5"
            type="number"
          />
          <FormSelect
            control={control}
            name="energyEfficiencyLabel"
            schema={chillerSystemSchema}
            id="chiller-eel"
            label="Energy efficiency label — Optional (A–G)"
            placeholder="Select"
            items={ENERGY_LABEL_ITEMS}
          />
          <FormSelect
            control={control}
            name="numberOfStars"
            schema={chillerSystemSchema}
            id="chiller-stars"
            label="Number of stars — Optional (1–5)"
            placeholder="Select"
            items={STARS_ITEMS}
          />
          <div className="col-span-2 space-y-1">
            <p className="label-small text-(--text--strong-950)">Total energy consumption annually — Auto-calculated</p>
            <div className="h-10 px-3 flex items-center justify-between rounded-md border border-input bg-(--bg--weak-50) text-sm text-(--text--sub-600) cursor-not-allowed">
              <span>{autoEnergy || "Auto-calculated"}</span>
              <span className="text-xs">kWh/year</span>
            </div>
          </div>
        </div>
      </DialogAccordion>
    </div>
  );
}
