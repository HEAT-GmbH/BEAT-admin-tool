"use client";

import { DialogAccordion, DialogDivider } from "@/components/dialog-addons";
import { FormEndLabel } from "@/components/form-addons";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import { AirConditionSystem, airConditionSystemSchema } from "@/screens/add-building/schema";
import { useQuery } from "@tanstack/react-query";
import { Control, useWatch } from "react-hook-form";

const CAPACITY_TO_KW: Record<string, number> = {
  ton: 3.516,
  btu_hr: 3.516 / 12000,
  kw: 1,
};

type AirConditionFormProps = {
  control: Control<AirConditionSystem>;
};

const AC_TYPE_ITEMS = [
  { value: "window", item: "Window air conditioner" },
  { value: "split", item: "Split air conditioner" },
  { value: "vrv", item: "Variable Refrigerant Flow (VRF)" },
  { value: "packaged", item: "Packaged / Ductable air conditioner" },
];

const PACKAGED_SUBTYPE_ITEMS = [
  { value: "rooftop", item: "Rooftop Unit" },
  { value: "floor_standing", item: "Floor-standing" },
  { value: "ductable", item: "Ductable" },
  { value: "cassette", item: "Cassette" },
];

const CAPACITY_UNIT_ITEMS = [
  { value: "ton", item: "Ton" },
  { value: "btu_hr", item: "BTU/hr" },
  { value: "kw", item: "kW" },
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

export function AirConditionForm({ control }: AirConditionFormProps) {
  const [
    acType,
    coolingCapacityPerUnit,
    coolingCapacityUnit,
    numberOfUnits,
    eerIseerCop,
    powerInputPerUnit,
    hours,
    days,
    weeks,
  ] = useWatch({
    control,
    name: [
      "acType",
      "coolingCapacityPerUnit",
      "coolingCapacityUnit",
      "numberOfUnits",
      "eerIseerCop",
      "powerInputPerUnit",
      "operatingSchedule.hours",
      "operatingSchedule.days",
      "operatingSchedule.weeks",
    ],
  });

  const autoEnergy = (() => {
    const units = Number(numberOfUnits) || 0;
    const h = Number(hours) || 0;
    const d = Number(days) || 0;
    const w = Number(weeks) || 0;
    if (!units || !h || !d || !w) return "";
    const power = Number(powerInputPerUnit) || 0;
    if (power > 0) {
      return (power * units * h * d * w).toFixed(3);
    }
    const cap = Number(coolingCapacityPerUnit) || 0;
    const eer = Number(eerIseerCop) || 0;
    const factor = CAPACITY_TO_KW[coolingCapacityUnit as string] ?? 1;
    if (cap > 0 && eer > 0) {
      return ((cap * factor * units / eer) * h * d * w).toFixed(3);
    }
    return "";
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
      <DialogDivider>Air Conditioner Data</DialogDivider>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          control={control}
          name="acType"
          schema={airConditionSystemSchema}
          id="ac-type"
          label="Type of air conditioner"
          placeholder="Select an option"
          items={AC_TYPE_ITEMS}
          fieldRequired
        />

        {acType === "packaged" && (
          <FormSelect
            control={control}
            name="packagedSubtype"
            schema={airConditionSystemSchema}
            id="ac-packaged-subtype"
            label="System sub-type"
            placeholder="Select sub-type"
            items={PACKAGED_SUBTYPE_ITEMS}
            fieldRequired
          />
        )}

        <FormInput
          control={control}
          name="yearOfInstallation"
          schema={airConditionSystemSchema}
          id="ac-year"
          label="Year of installation"
          placeholder="e.g. 2021"
          type="number"
          fieldRequired
        />
        <FormSelect
          control={control}
          name="refrigerantType"
          schema={airConditionSystemSchema}
          id="ac-refrigerant"
          label="Type of refrigerants"
          placeholder="Select an option"
          items={refrigerantItems}
          fieldRequired
        />
        <FormInput
          control={control}
          name="refrigerantQuantity"
          schema={airConditionSystemSchema}
          id="ac-refrigerant-qty"
          label="Refrigerant quantity"
          placeholder="e.g. 1.5 – 5 kg/unit"
          type="number"
          endAddon={<FormEndLabel label="kg" />}
          fieldRequired
        />

        {/* Cooling capacity per unit with unit selector */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="coolingCapacityPerUnit"
            schema={airConditionSystemSchema}
            id="ac-capacity"
            label="Cooling capacity per unit"
            placeholder="e.g. 1.5"
            type="number"
            fieldRequired
          />
          <FormSelect
            control={control}
            name="coolingCapacityUnit"
            schema={airConditionSystemSchema}
            id="ac-capacity-unit"
            label="Capacity unit"
            placeholder="Select unit"
            items={CAPACITY_UNIT_ITEMS}
            fieldRequired
          />
        </div>

        <FormInput
          control={control}
          name="numberOfUnits"
          schema={airConditionSystemSchema}
          id="ac-units"
          label="Number of units"
          placeholder="e.g. 5"
          type="number"
          fieldRequired
        />
        <FormInput
          control={control}
          name="baselineLeakageFactor"
          schema={airConditionSystemSchema}
          id="ac-leakage"
          label="Baseline leakage factor"
          placeholder="2 (new) or 10 (old)"
          type="number"
          endAddon={<FormEndLabel label="%" />}
          fieldRequired
        />

        {/* Annual operating schedule */}
        <div className="col-span-2 space-y-1">
          <p className="label-small text-foreground flex items-center gap-0.5">
            Annual operating schedule<span className="text-error">*</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <FormInput
              control={control}
              name="operatingSchedule.hours"
              schema={airConditionSystemSchema}
              id="ac-hours"
              placeholder="e.g. 8"
              type="number"
              endAddon={<FormEndLabel label="Hours / day" />}
            />
            <FormInput
              control={control}
              name="operatingSchedule.days"
              schema={airConditionSystemSchema}
              id="ac-days"
              placeholder="e.g. 5"
              type="number"
              endAddon={<FormEndLabel label="Days / week" />}
            />
            <FormInput
              control={control}
              name="operatingSchedule.weeks"
              schema={airConditionSystemSchema}
              id="ac-weeks"
              placeholder="e.g. 52"
              type="number"
              endAddon={<FormEndLabel label="Weeks / year" />}
            />
          </div>
        </div>

        <div className="col-span-2">
          <FormInput
            control={control}
            name="eerIseerCop"
            schema={airConditionSystemSchema}
            id="ac-eer"
            label="EER / ISEER / COP"
            placeholder="e.g. 2.8"
            type="number"
            fieldRequired
          />
        </div>
      </div>

      <DialogAccordion>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="powerInputPerUnit"
            schema={airConditionSystemSchema}
            id="ac-power-input"
            label="Power input per unit — Optional"
            placeholder="e.g. 0.8 – 1.8 kW"
            type="number"
            endAddon={<FormEndLabel label="kW" />}
          />
          <div className="space-y-1">
            <p className="label-small text-(--text--strong-950)">Total energy consumption annually — Auto-calculated</p>
            <div className="h-10 px-3 flex items-center justify-between rounded-md border border-input bg-(--bg--weak-50) text-sm text-(--text--sub-600) cursor-not-allowed">
              <span>{autoEnergy || "Auto-calculated"}</span>
              <span className="text-xs">kWh/year</span>
            </div>
          </div>
          <FormSelect
            control={control}
            name="energyEfficiencyLabel"
            schema={airConditionSystemSchema}
            id="ac-eel"
            label="Energy efficiency label — Optional (A–G)"
            placeholder="Select"
            items={ENERGY_LABEL_ITEMS}
          />
          <FormSelect
            control={control}
            name="numberOfStars"
            schema={airConditionSystemSchema}
            id="ac-stars"
            label="Number of stars — Optional (1–5)"
            placeholder="Select"
            items={STARS_ITEMS}
          />
        </div>
      </DialogAccordion>
    </div>
  );
}
