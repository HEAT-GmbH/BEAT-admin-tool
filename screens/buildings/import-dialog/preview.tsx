"use client";
import { Icon } from "@/components/icon";
import { Progress } from "@/components/progress";
import { useEffect, useState } from "react";
import { useSteps } from "./steps.context";

interface StepStatus {
  label: string;
  status: "pending" | "running" | "success" | "skipped" | "error";
  error?: string;
}

/**
 * Maps a sheet name prefix (lowercase) to the API step slug.
 * Matching is done with startsWith so multi-variant sheets
 * (e.g. "Cooling System - Window air con") resolve to the same step.
 */
const SHEET_PREFIX_TO_STEP: Array<{ prefix: string; step: string }> = [
  { prefix: "building details", step: "details" },
  { prefix: "operational schedule", step: "operational-schedule" },
  { prefix: "cooling system", step: "cooling-systems" },
  { prefix: "chiller system", step: "cooling-systems" },
  { prefix: "ventillation system", step: "ventilation-systems" },
  { prefix: "lightning system", step: "lighting-systems" },
  { prefix: "lift & escalator", step: "lift-escalator" },
  { prefix: "hot water system", step: "hot-water-systems" },
  { prefix: "operational energy carriers", step: "energy-carriers" },
  { prefix: "structural components", step: "structural-components" },
];

function sheetNameToStep(name: string): string | null {
  const lower = name.trim().toLowerCase();
  const match = SHEET_PREFIX_TO_STEP.find((e) => lower.startsWith(e.prefix));
  return match ? match.step : null;
}

const STEP_LABELS: Record<string, string> = {
  "details": "Building Details",
  "operational-schedule": "Operational Schedule",
  "cooling-systems": "Cooling Systems",
  "ventilation-systems": "Ventilation Systems",
  "lighting-systems": "Lighting Systems",
  "lift-escalator": "Lift & Escalator",
  "hot-water-systems": "Hot Water Systems",
  "energy-carriers": "Energy Carriers",
  "structural-components": "Structural Components",
};

const ORDERED_STEPS = [
  "details",
  "operational-schedule",
  "cooling-systems",
  "ventilation-systems",
  "lighting-systems",
  "lift-escalator",
  "hot-water-systems",
  "energy-carriers",
  "structural-components",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDetailsFormData(buildingUuid: string, rows: any[][]): FormData {
  const fd = new FormData();
  fd.append("building_uuid", buildingUuid);
  if (rows.length < 2) return fd;
  const headers = rows[0];
  const dataRow = rows[1];

  const get = (...keys: string[]) => {
    for (const key of keys) {
      const idx = (headers as unknown[]).findIndex(
        (h) =>
          typeof h === "string" &&
          h.trim().toLowerCase() === key.toLowerCase(),
      );
      if (idx !== -1 && dataRow[idx] !== null && dataRow[idx] !== undefined)
        return String(dataRow[idx]);
    }
    return null;
  };

  const fields: Record<string, string | null> = {
    building_type: get("building_type", "building type", "type"),
    climate_type: get("climate_type", "climate type", "climate"),
    assessment_period: get("assessment_period", "assessment period"),
    total_floor_area: get("total_floor_area", "total floor area", "floor area"),
    conditioned_floor_area: get(
      "conditioned_floor_area",
      "conditioned floor area",
    ),
    construction_year: get("construction_year", "construction year"),
    floors_below_ground: get("floors_below_ground", "floors below ground"),
    has_certification: get("has_certification"),
    has_boq: get("has_boq"),
  };

  for (const [k, v] of Object.entries(fields)) {
    if (v !== null) fd.append(k, v);
  }
  return fd;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildJsonPayload(step: string, buildingUuid: string, rows: any[][]): unknown {
  if (rows.length < 2) return { building_uuid: buildingUuid };
  const headers = rows[0];

  // For system tabs (cooling, ventilation, lighting, hot-water),
  // we wrap all data rows as a single "systems" entry with the first header as the tab.
  const dataRows = rows.slice(1).filter((r) =>
    r.some((cell) => cell !== null && cell !== undefined && cell !== ""),
  );

  if (
    [
      "cooling-systems",
      "ventilation-systems",
      "lighting-systems",
      "hot-water-systems",
    ].includes(step)
  ) {
    return {
      building_uuid: buildingUuid,
      systems: [{ tab: headers[0] ?? step, rows: dataRows }],
    };
  }

  if (step === "lift-escalator") {
    return { building_uuid: buildingUuid, rows: dataRows };
  }

  if (step === "energy-carriers") {
    return { building_uuid: buildingUuid, rows: dataRows };
  }

  if (step === "structural-components") {
    return { building_uuid: buildingUuid, rows: dataRows };
  }

  if (step === "operational-schedule") {
    const get = (...keys: string[]) => {
      for (const key of keys) {
        const idx = (headers as unknown[]).findIndex(
          (h) =>
            typeof h === "string" &&
            h.trim().toLowerCase() === key.toLowerCase(),
        );
        if (
          idx !== -1 &&
          dataRows[0]?.[idx] !== null &&
          dataRows[0]?.[idx] !== undefined
        )
          return dataRows[0][idx];
      }
      return undefined;
    };

    return {
      building_uuid: buildingUuid,
      num_residents: get("num_residents", "number of residents"),
      hours_per_workday: get("hours_per_workday"),
      workdays_per_week: get("workdays_per_week"),
      weeks_per_year: get("weeks_per_year"),
      heating_temp: get("heating_temp", "heating temperature"),
      heating_temp_unit: get("heating_temp_unit"),
      cooling_temp: get("cooling_temp", "cooling temperature"),
      cooling_temp_unit: get("cooling_temp_unit"),
      renewable_energy_percent: get("renewable_energy_percent"),
      building_smart_system: get("building_smart_system"),
    };
  }

  return { building_uuid: buildingUuid };
}

export const Preview = () => {
  const { parsedSheets, buildingUuid, toggleComplete, item } = useSteps();
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(() =>
    ORDERED_STEPS.map((s) => ({
      label: STEP_LABELS[s],
      status: "pending",
    })),
  );
  const [overallProgress, setOverallProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const updateStep = (index: number, patch: Partial<StepStatus>) => {
    setStepStatuses((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  useEffect(() => {
    if (!buildingUuid) return;

    const run = async () => {
      setIsRunning(true);
      const total = ORDERED_STEPS.length;

      for (let i = 0; i < ORDERED_STEPS.length; i++) {
        const step = ORDERED_STEPS[i];

        // Find all sheets that map to this step (there may be multiple variants).
        const matchingSheets = parsedSheets.filter(
          (s) => sheetNameToStep(s.name) === step,
        );

        if (matchingSheets.length === 0) {
          updateStep(i, { status: "skipped" });
          setOverallProgress(Math.round(((i + 1) / total) * 100));
          continue;
        }

        updateStep(i, { status: "running" });

        try {
          let res: Response;
          if (step === "details") {
            // Only first matching sheet used for details (single-row form).
            const fd = buildDetailsFormData(buildingUuid, matchingSheets[0].rows);
            res = await fetch("/api/buildings/import/details", {
              method: "POST",
              body: fd,
            });
          } else if (
            ["cooling-systems", "ventilation-systems", "lighting-systems", "hot-water-systems"].includes(step)
          ) {
            // Send all variant sheets together as multiple system entries.
            const systems = matchingSheets
              .map((s) => {
                const dataRows = s.rows.slice(1).filter((r) =>
                  r.some((cell) => cell !== null && cell !== undefined && cell !== ""),
                );
                return { tab: s.rows[0]?.[0] ?? s.name, rows: dataRows };
              })
              .filter((s) => s.rows.length > 0);
            const payload = { building_uuid: buildingUuid, systems };
            res = await fetch(`/api/buildings/import/${step}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } else {
            const payload = buildJsonPayload(step, buildingUuid, matchingSheets[0].rows);
            res = await fetch(`/api/buildings/import/${step}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }

          if (res.ok) {
            updateStep(i, { status: "success" });
          } else {
            const errData = await res.json().catch(() => null);
            const msg =
              errData?.detail ?? errData?.message ?? `Status ${res.status}`;
            updateStep(i, { status: "error", error: msg });
          }
        } catch (err) {
          console.error(`[import/${step}]`, err);
          updateStep(i, { status: "error", error: "Network error" });
        }

        setOverallProgress(Math.round(((i + 1) / total) * 100));
      }

      toggleComplete(item.id, true);
      setIsRunning(false);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingUuid]);

  const statusIcon = (status: StepStatus["status"]) => {
    switch (status) {
      case "success":
        return (
          <Icon
            name="select-box-circle-fill"
            size={18}
            className="text-(--state--success--base)"
          />
        );
      case "error":
        return (
          <Icon
            name="close-circle-fill"
            size={18}
            className="text-(--state--error--base)"
          />
        );
      case "skipped":
        return (
          <Icon
            name="forbid-fill"
            size={18}
            className="text-(--text--sub-600) opacity-40"
          />
        );
      case "running":
        return (
          <Icon
            name="information-fill"
            size={18}
            className="text-(--state--information--base)"
          />
        );
      default:
        return (
          <Icon
            name="information-2-line"
            size={18}
            className="text-(--text--sub-600) opacity-30"
          />
        );
    }
  };

  return (
    <div className="size-full flex flex-col gap-4">
      <div className="space-y-1 shrink-0">
        <h6 className="h6-title text-foreground">Importing Building Data</h6>
        <p className="paragraph-small text-(--text--sub-600)">
          Each data section is being submitted to the server.
        </p>
      </div>

      <div className="space-y-0.5">
        <div className="flex justify-between items-center gap-2">
          <p className="label-small text-foreground">
            {isRunning ? "Importing…" : "Import complete"}
          </p>
          <span className="paragraph-x-small text-(--text--sub-600)">
            {overallProgress}%
          </span>
        </div>
        <Progress value={overallProgress} barClassName="bg-(--state--success--base)" />
      </div>

      <div className="flex-1 overflow-auto no-scrollbar space-y-2">
        {stepStatuses.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-(--bg--weak-50)"
          >
            <div className="flex items-center gap-3">
              {statusIcon(s.status)}
              <span className="paragraph-small text-foreground">{s.label}</span>
            </div>
            {s.status === "error" && s.error && (
              <span className="label-x-small text-(--state--error--base) text-right max-w-40 truncate">
                {s.error}
              </span>
            )}
            {s.status === "skipped" && (
              <span className="label-x-small text-(--text--sub-600) opacity-50">
                Not in file
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
