"use client";
import { Icon } from "@/components/icon";
import { useEffect, useRef, useState } from "react";
import { useSteps, ParsedSheet } from "./steps.context";

// ---------------------------------------------------------------------------
// Sheet-name normalisation & step mapping
// ---------------------------------------------------------------------------

function normaliseSheet(s: string) {
  return s.trim().toLowerCase().replace(/l{2,}/g, "l").replace(/\s+/g, " ");
}

const SHEET_PREFIX_TO_STEP: Array<{ prefix: string; step: string }> = [
  { prefix: "building details", step: "details" },
  { prefix: "operational schedule", step: "operational-schedule" },
  { prefix: "cooling system", step: "cooling-systems" },
  { prefix: "chiller system", step: "cooling-systems" },
  { prefix: "ventilation system", step: "ventilation-systems" },
  { prefix: "lightning system", step: "lighting-systems" },
  { prefix: "lighting system", step: "lighting-systems" },
  { prefix: "lift & escalator", step: "lift-escalator" },
  { prefix: "hot water system", step: "hot-water-systems" },
  { prefix: "operational energy carriers", step: "energy-carriers" },
  { prefix: "structural components", step: "structural-components" },
];

function sheetNameToStep(name: string): string | null {
  const norm = normaliseSheet(name);
  const match = SHEET_PREFIX_TO_STEP.find((e) => norm.startsWith(e.prefix));
  return match ? match.step : null;
}

// ---------------------------------------------------------------------------
// Helpers to extract fields from sheet rows
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getField(headers: any[], row: any[], ...keys: string[]): string | null {
  for (const key of keys) {
    const idx = headers.findIndex(
      (h: unknown) =>
        typeof h === "string" && h.trim().toLowerCase() === key.toLowerCase(),
    );
    if (idx !== -1 && row[idx] !== null && row[idx] !== undefined)
      return String(row[idx]);
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractNameLocation(rows: any[][]): Record<string, string | null> {
  if (rows.length < 2) return {};
  const headers = rows[0];
  const row = rows[1];
  return {
    building_name: getField(headers, row, "building name or code", "building_name", "name"),
    address: getField(headers, row, "address (zip, street)", "address", "building_address"),
    country: getField(headers, row, "country", "country of building"),
    region: getField(headers, row, "region or state", "region", "state"),
    city: getField(headers, row, "city", "building_city"),
    longitude: getField(headers, row, "longitude (optional)", "longitude"),
    latitude: getField(headers, row, "latitude (optional)", "latitude"),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractBuildingDetails(rows: any[][]): Record<string, string | null> {
  if (rows.length < 2) return {};
  const headers = rows[0];
  const row = rows[1];
  return {
    building_type: getField(headers, row, "building_type", "building type", "type"),
    climate_type: getField(headers, row, "climate_type", "climate type", "area climate type", "climate"),
    assessment_period: getField(headers, row, "assessment_period", "assessment period (years)", "assessment period"),
    total_floor_area: getField(headers, row, "total_floor_area", "total floor area (m²)", "total floor area (m2)", "total floor area"),
    conditioned_floor_area: getField(headers, row, "conditioned_floor_area", "conditioned floor area (m²)", "conditioned floor area (m2)", "conditioned floor area"),
    construction_year: getField(headers, row, "construction_year", "construction year"),
    floors_below_ground: getField(headers, row, "floors_below_ground", "floors below ground", "number of floors below ground"),
    has_certification: getField(headers, row, "has_certification", "has the building's certification process underway/been completed? (default no)", "has certification"),
    has_boq: getField(headers, row, "has_boq", "does the building have design drawings and bill of quantities (boq), would you like to upload it? (default no)", "has boq / design drawings", "has boq"),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractOperationalSchedule(rows: any[][]): Record<string, string | null> {
  if (rows.length < 2) return {};
  const headers = rows[0];
  const row = rows[1];
  return {
    num_residents: getField(headers, row, "num_residents", "number of residents (occupants)", "number of residents"),
    hours_per_workday: getField(headers, row, "hours_per_workday", "annual operating schedule (hours/day)"),
    workdays_per_week: getField(headers, row, "workdays_per_week", "annual operating schedule (days/week)"),
    weeks_per_year: getField(headers, row, "weeks_per_year", "annual operating schedule (weeks/year)"),
    heating_temp: getField(headers, row, "heating_temp", "room heating temperature", "heating temperature"),
    heating_temp_unit: getField(headers, row, "heating_temp_unit", "room heating temperature unit (celsius or fahrenheit)", "heating temperature unit"),
    cooling_temp: getField(headers, row, "cooling_temp", "room cooling temperature", "cooling temperature"),
    cooling_temp_unit: getField(headers, row, "cooling_temp_unit", "room cooling temperature unit (celsius or fahrenheit)", "cooling temperature unit"),
    renewable_energy_percent: getField(headers, row, "renewable_energy_percent", "renewable energy installation (%)"),
    building_smart_system: getField(headers, row, "building_smart_system", "building smart system installation (default no)", "building smart system installation"),
  };
}

// ---------------------------------------------------------------------------
// Build payloads for each API step
// ---------------------------------------------------------------------------

function buildDetailsFormData(
  buildingUuid: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][],
  certFile: File | null,
  boqFiles: File[],
): FormData {
  const fd = new FormData();
  fd.append("building_uuid", buildingUuid);
  if (rows.length < 2) return fd;

  const details = extractBuildingDetails(rows);
  for (const [k, v] of Object.entries(details)) {
    if (v !== null) fd.append(k, v);
  }
  if (certFile) fd.append("certification_file", certFile);
  for (const f of boqFiles) fd.append("boq_files", f);
  return fd;
}

function buildJsonPayload(
  step: string,
  buildingUuid: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchingSheets: ParsedSheet[],
): unknown {
  if (step === "operational-schedule") {
    const rows = matchingSheets[0]?.rows ?? [];
    const fields = extractOperationalSchedule(rows);
    return { building_uuid: buildingUuid, ...Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== null)) };
  }

  if (["cooling-systems", "ventilation-systems", "lighting-systems", "hot-water-systems"].includes(step)) {
    const systems = matchingSheets
      .map((s) => {
        const dataRows = s.rows.slice(1).filter((r) =>
          r.some((cell) => cell !== null && cell !== undefined && cell !== ""),
        );
        return { tab: s.rows[0]?.[0] ?? s.name, rows: dataRows };
      })
      .filter((s) => s.rows.length > 0);
    return { building_uuid: buildingUuid, systems };
  }

  if (step === "lift-escalator" || step === "energy-carriers" || step === "structural-components") {
    const rows = matchingSheets[0]?.rows ?? [];
    const dataRows = rows.slice(1).filter((r) =>
      r.some((cell) => cell !== null && cell !== undefined && cell !== ""),
    );
    return { building_uuid: buildingUuid, rows: dataRows };
  }

  return { building_uuid: buildingUuid };
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

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

/** Sub-tab label: strip leading group prefix */
function subTabLabel(sheetName: string): string {
  return sheetName.replace(/^[^-]+-\s*/i, "").trim() || sheetName;
}

interface RowProps {
  label: string;
  value: string | null | undefined;
}
function DataRow({ label, value }: RowProps) {
  return (
    <div className="grid grid-cols-2 px-4 py-2 gap-4 border-b border-border last:border-0">
      <span className="paragraph-x-small text-(--text--sub-600) truncate">{label}</span>
      <span className="paragraph-x-small text-foreground truncate text-right">{value || "—"}</span>
    </div>
  );
}

function SectionHeader({ title, found }: { title: string; found: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-(--bg--weak-50)">
      {found ? (
        <Icon name="select-box-circle-fill" size={16} className="text-(--state--success--base) shrink-0" />
      ) : (
        <Icon name="close-circle-fill" size={16} className="text-(--text--sub-600) opacity-40 shrink-0" />
      )}
      <span className={found ? "label-small text-foreground" : "label-small text-(--text--sub-600) opacity-50"}>
        {title}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const Preview = () => {
  const { parsedSheets, organisationId, setBuildingUuid, toggleComplete, item, setStep } = useSteps();

  const certInputRef = useRef<HTMLInputElement>(null);
  const boqInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract data from parsed sheets
  const nameLocationSheet = parsedSheets.find((s) =>
    normaliseSheet(s.name).startsWith("building name and location"),
  );
  const detailsSheet = parsedSheets.find((s) =>
    normaliseSheet(s.name).startsWith("building details"),
  );
  const opScheduleSheet = parsedSheets.find((s) =>
    normaliseSheet(s.name).startsWith("operational schedule"),
  );

  const nameLocation = nameLocationSheet ? extractNameLocation(nameLocationSheet.rows) : {};
  const details = detailsSheet ? extractBuildingDetails(detailsSheet.rows) : {};
  const opSchedule = opScheduleSheet ? extractOperationalSchedule(opScheduleSheet.rows) : {};

  const hasCert = (details.has_certification ?? "").toLowerCase() === "yes";
  const hasBoq = (details.has_boq ?? "").toLowerCase() === "yes";

  // Register the "Confirm & Import" action on the footer button via context
  // We expose a submit trigger through useEffect + a ref the footer can call.
  // Instead: the footer's "Confirm & Import" click is wired through a custom
  // event so the Preview component owns all submission logic.
  const submitRef = useRef<(() => Promise<void>) | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: name-location
      const namePayload: Record<string, string> = {};
      if (nameLocation.building_name) namePayload.building_name = nameLocation.building_name;
      if (nameLocation.address) namePayload.address = nameLocation.address;
      if (nameLocation.country) namePayload.country = nameLocation.country;
      if (nameLocation.region) namePayload.region = nameLocation.region;
      if (nameLocation.city) namePayload.city = nameLocation.city;
      if (nameLocation.longitude) namePayload.longitude = nameLocation.longitude;
      if (nameLocation.latitude) namePayload.latitude = nameLocation.latitude;
      if (organisationId) namePayload.organisation_id = organisationId;

      const nameRes = await fetch("/api/buildings/import/name-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(namePayload),
      });
      const nameData = await nameRes.json();
      if (!nameRes.ok) {
        // No building created yet — just show the error, nothing to clean up.
        setError(nameData?.detail ?? nameData?.message ?? `Name/location failed (${nameRes.status})`);
        setIsSubmitting(false);
        return;
      }
      const buildingUuid: string = nameData?.building_uuid ?? nameData?.uuid;
      setBuildingUuid(buildingUuid);

      /**
       * Rollback: building was created but a subsequent step failed.
       * The backend leaves partial buildings in the DB, so we delete it here.
       */
      const rollback = async (message: string) => {
        try {
          await fetch(`/api/buildings/${buildingUuid}`, { method: "DELETE" });
        } catch {
          // best-effort — don't block the error display
        }
        setBuildingUuid(null);
        setError(message);
        setIsSubmitting(false);
      };

      // Step 2: details (with optional file uploads)
      if (detailsSheet) {
        const certFile = hasCert ? (certInputRef.current?.files?.[0] ?? null) : null;
        const boqFiles = hasBoq ? Array.from(boqInputRef.current?.files ?? []) : [];
        const fd = buildDetailsFormData(buildingUuid, detailsSheet.rows, certFile, boqFiles);
        const detRes = await fetch("/api/buildings/import/details", { method: "POST", body: fd });
        if (!detRes.ok) {
          const d = await detRes.json().catch(() => null);
          await rollback(d?.detail ?? d?.message ?? `Building details failed (${detRes.status})`);
          return;
        }
      }

      // Remaining steps — skip if no data rows, fail+rollback if endpoint errors
      for (const step of ORDERED_STEPS.filter((s) => s !== "details")) {
        const matchingSheets = parsedSheets.filter((s) => sheetNameToStep(s.name) === step);
        if (matchingSheets.length === 0) continue;

        const payload = buildJsonPayload(step, buildingUuid, matchingSheets);
        const res = await fetch(`/api/buildings/import/${step}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          await rollback(d?.detail ?? d?.message ?? `"${step}" import failed (${res.status})`);
          return;
        }
      }

      // Complete
      const completeRes = await fetch("/api/buildings/import/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ building_uuid: buildingUuid }),
      });
      if (!completeRes.ok) {
        const d = await completeRes.json().catch(() => null);
        await rollback(d?.detail ?? d?.message ?? `Finalisation failed (${completeRes.status})`);
        return;
      }

      toggleComplete(item.id, true);
      setStep((prev) => prev + 1);
    } catch (err) {
      console.error("[import/preview]", err);
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Expose submit handler so Footer can call it
  submitRef.current = handleSubmit;

  // Patch the footer button to call our submit instead of just advancing step.
  // We do this by marking the preview step as "completed" only after submission,
  // but we need the button to trigger submission. We use a DOM event approach.
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      submitRef.current?.();
    };
    window.addEventListener("import-preview-confirm", handler);
    return () => window.removeEventListener("import-preview-confirm", handler);
  }, []);

  // Multi-sheet groups for systems display
  const systemGroups: { label: string; prefix: string; step: string }[] = [
    { label: "Cooling Systems", prefix: "cooling system", step: "cooling-systems" },
    { label: "Chiller Systems", prefix: "chiller system", step: "cooling-systems" },
    { label: "Ventilation Systems", prefix: "ventilation system", step: "ventilation-systems" },
    { label: "Lighting Systems", prefix: "lightning system", step: "lighting-systems" },
    { label: "Lift & Escalator", prefix: "lift & escalator", step: "lift-escalator" },
    { label: "Hot Water Systems", prefix: "hot water system", step: "hot-water-systems" },
    { label: "Operational Energy Carriers", prefix: "operational energy carriers", step: "energy-carriers" },
    { label: "Structural Components", prefix: "structural components", step: "structural-components" },
  ];

  return (
    <div className="size-full flex flex-col gap-4">
      <div className="space-y-1 shrink-0">
        <h6 className="h6-title text-foreground">Preview &amp; Confirm</h6>
        <p className="paragraph-small text-(--text--sub-600)">
          Review the data that will be imported. Upload any required files below,
          then click Confirm &amp; Import.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-(--state--error--lighter) border border-(--state--error--base)">
          <Icon name="error-warning-fill" size={16} className="text-(--state--error--base) shrink-0" />
          <span className="paragraph-small text-(--state--error--base)">{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-auto no-scrollbar space-y-3">

        {/* Name & Location */}
        <div className="rounded-lg border border-border overflow-hidden">
          <SectionHeader title="Building Name & Location" found={!!nameLocationSheet} />
          {nameLocationSheet && (
            <>
              <DataRow label="Building name" value={nameLocation.building_name} />
              <DataRow label="Address" value={nameLocation.address} />
              <DataRow label="Country" value={nameLocation.country} />
              <DataRow label="Region or State" value={nameLocation.region} />
              <DataRow label="City" value={nameLocation.city} />
              <DataRow label="Longitude" value={nameLocation.longitude} />
              <DataRow label="Latitude" value={nameLocation.latitude} />
            </>
          )}
        </div>

        {/* Building Details */}
        <div className="rounded-lg border border-border overflow-hidden">
          <SectionHeader title="Building Details" found={!!detailsSheet} />
          {detailsSheet && (
            <>
              <DataRow label="Building type" value={details.building_type} />
              <DataRow label="Area climate type" value={details.climate_type} />
              <DataRow label="Assessment period (years)" value={details.assessment_period} />
              <DataRow label="Total floor area (m²)" value={details.total_floor_area} />
              <DataRow label="Conditioned floor area (m²)" value={details.conditioned_floor_area} />
              <DataRow label="Construction year" value={details.construction_year} />
              <DataRow label="Floors below ground" value={details.floors_below_ground} />
              <DataRow label="Has certification" value={details.has_certification} />
              <DataRow label="Has BoQ / design drawings" value={details.has_boq} />
            </>
          )}
        </div>

        {/* Operational Schedule */}
        {opScheduleSheet && (
          <div className="rounded-lg border border-border overflow-hidden">
            <SectionHeader title="Operational Schedule & Temperature" found />
            <DataRow label="Number of residents" value={opSchedule.num_residents} />
            <DataRow label="Hours per day" value={opSchedule.hours_per_workday} />
            <DataRow label="Days per week" value={opSchedule.workdays_per_week} />
            <DataRow label="Weeks per year" value={opSchedule.weeks_per_year} />
            <DataRow label="Room heating temperature" value={opSchedule.heating_temp} />
            <DataRow label="Heating temperature unit" value={opSchedule.heating_temp_unit} />
            <DataRow label="Room cooling temperature" value={opSchedule.cooling_temp} />
            <DataRow label="Cooling temperature unit" value={opSchedule.cooling_temp_unit} />
            <DataRow label="Renewable energy (%)" value={opSchedule.renewable_energy_percent} />
            <DataRow label="Building smart system" value={opSchedule.building_smart_system} />
          </div>
        )}

        {/* System groups */}
        {systemGroups.map((group) => {
          const sheets = parsedSheets.filter((s) =>
            normaliseSheet(s.name).startsWith(normaliseSheet(group.prefix)),
          );
          if (sheets.length === 0) return null;
          return (
            <div key={group.label} className="rounded-lg border border-border overflow-hidden">
              <SectionHeader title={group.label} found />
              {sheets.map((sheet: ParsedSheet) => {
                const dataRows = Math.max(0, sheet.rows.length - 1);
                return (
                  <div key={sheet.name} className="flex items-center justify-between px-4 py-2 border-b border-border last:border-0">
                    <span className="paragraph-x-small text-(--text--sub-600)">{subTabLabel(sheet.name)}</span>
                    <span className="label-x-small text-(--text--sub-600)">{dataRows} {dataRows === 1 ? "row" : "rows"}</span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Certification file upload */}
        {hasCert && (
          <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
            <div className="flex items-center gap-2">
              <Icon name="file-check-fill" size={16} className="text-(--state--information--base) shrink-0" />
              <p className="label-small text-foreground">
                Certification file <span className="text-(--state--error--base)">*</span>
              </p>
            </div>
            <p className="paragraph-x-small text-(--text--sub-600)">
              Your template indicates this building has a certification. Please upload the certificate.
              Accepted: JPG, PNG, GIF, WEBP, PDF — max 20 MB.
            </p>
            <input
              ref={certInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
              className="block w-full text-sm text-(--text--sub-600) file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-(--bg--weak-50) file:text-foreground hover:file:bg-muted cursor-pointer"
            />
          </div>
        )}

        {/* BoQ files upload */}
        {hasBoq && (
          <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
            <div className="flex items-center gap-2">
              <Icon name="file-paper-2-fill" size={16} className="text-(--state--information--base) shrink-0" />
              <p className="label-small text-foreground">
                Bill of Quantities &amp; design drawings <span className="text-(--state--error--base)">*</span>
              </p>
            </div>
            <p className="paragraph-x-small text-(--text--sub-600)">
              Your template indicates this building has BoQ / design drawing files. Please upload one or more files.
              Accepted: JPG, PNG, GIF, WEBP, PDF — max 20 MB each.
            </p>
            <input
              ref={boqInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
              multiple
              className="block w-full text-sm text-(--text--sub-600) file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-(--bg--weak-50) file:text-foreground hover:file:bg-muted cursor-pointer"
            />
          </div>
        )}

      </div>

      {/* Confirm & Import button lives here (inside the scrollable content area footer) */}
      <div className="shrink-0 pt-2 border-t border-border">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full h-10 rounded-lg bg-primary text-primary-foreground label-small hover:bg-primary/80 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {isSubmitting ? "Importing…" : "Confirm & Import"}
        </button>
      </div>
    </div>
  );
};
