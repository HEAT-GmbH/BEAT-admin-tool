"use client";
import { Icon } from "@/components/icon";
import { useEffect } from "react";
import { useSteps, ParsedSheet } from "./steps.context";

/**
 * Normalise a sheet name for fuzzy matching:
 * - lowercase
 * - collapse repeated letters (ventillation → ventilation)
 * - trim
 */
function normalise(s: string) {
  return s.trim().toLowerCase().replace(/l{2,}/g, "l").replace(/\s+/g, " ");
}

/**
 * Groups of tabs that map to the same import step.
 * `prefixes` are normalised — all checked with startsWith.
 */
const TAB_GROUPS: {
  label: string;
  prefixes: string[];
  /** If true, show individual column headers + sample value (single-row tabs). */
  showColumns?: boolean;
}[] = [
  {
    label: "Name & Location",
    prefixes: ["building name and location"],
    showColumns: true,
  },
  {
    label: "Building Details",
    prefixes: ["building details"],
    showColumns: true,
  },
  {
    label: "Operational Schedule & Temp",
    prefixes: ["operational schedule"],
    showColumns: true,
  },
  { label: "Cooling Systems", prefixes: ["cooling system", "chiller system"] },
  { label: "Ventilation Systems", prefixes: ["ventilation system", "ventillation system"] },
  { label: "Lighting Systems", prefixes: ["lightning system", "lighting system"] },
  { label: "Lift & Escalator", prefixes: ["lift & escalator"] },
  { label: "Hot Water Systems", prefixes: ["hot water system"] },
  {
    label: "Operational Energy Carriers",
    prefixes: ["operational energy carriers"],
    showColumns: true,
  },
  { label: "Structural Components", prefixes: ["structural components"] },
];

function matchesGroup(sheetName: string, prefixes: string[]): boolean {
  const norm = normalise(sheetName);
  return prefixes.some((p) => norm.startsWith(normalise(p)));
}

/** For single-row tabs: extract header + sample value pairs (skip empty). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractColumns(rows: any[][]): { header: string; value: string }[] {
  if (rows.length < 2) return [];
  const headers = rows[0];
  const dataRow = rows[1];
  const result: { header: string; value: string }[] = [];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (!header) continue;
    const raw = dataRow?.[i];
    const value =
      raw === null || raw === undefined || raw === "" ? "—" : String(raw);
    result.push({ header: String(header), value });
  }
  return result;
}

/** For multi-sheet tabs: derive a readable sub-tab label from the sheet name. */
function subTabLabel(sheetName: string, groupLabel: string): string {
  // Strip leading group prefix (e.g. "Cooling System - " or "Chiller System - ")
  const norm = sheetName.replace(/^[^-]+-\s*/i, "").trim();
  return norm || groupLabel;
}

export const MapFields = () => {
  const { parsedSheets, toggleComplete, item } = useSteps();

  useEffect(() => {
    toggleComplete(item.id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (parsedSheets.length === 0) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-2 text-center">
        <p className="paragraph-small text-(--text--sub-600)">
          No sheets detected. Please go back and re-upload your file.
        </p>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col gap-4">
      <div className="space-y-1 shrink-0">
        <h6 className="h6-title text-foreground">Map Your Columns</h6>
        <p className="paragraph-small text-(--text--sub-600)">
          Review the column mapping detected from your file. All columns matched
          automatically.
        </p>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar space-y-3">
        {TAB_GROUPS.map((group) => {
          const matchingSheets = parsedSheets.filter((s) =>
            matchesGroup(s.name, group.prefixes),
          );
          const found = matchingSheets.length > 0;

          return (
            <div key={group.label} className="rounded-lg border border-border overflow-hidden">
              {/* Group header */}
              <div className="flex items-center justify-between px-4 py-3 bg-(--bg--weak-50)">
                <div className="flex items-center gap-3">
                  {found ? (
                    <Icon
                      name="select-box-circle-fill"
                      size={16}
                      className="text-(--state--success--base) shrink-0"
                    />
                  ) : (
                    <Icon
                      name="close-circle-fill"
                      size={16}
                      className="text-(--text--sub-600) opacity-40 shrink-0"
                    />
                  )}
                  <span
                    className={
                      found
                        ? "label-small text-foreground"
                        : "label-small text-(--text--sub-600) opacity-50"
                    }
                  >
                    {group.label}
                  </span>
                </div>
                {!found && (
                  <span className="label-x-small text-(--text--sub-600) opacity-50">
                    Not found
                  </span>
                )}
              </div>

              {/* Single-row tabs: show column → value table */}
              {found && group.showColumns && (() => {
                const sheet = matchingSheets[0];
                const cols = extractColumns(sheet.rows);
                if (cols.length === 0) return null;
                return (
                  <div className="divide-y divide-border">
                    {cols.map((col) => (
                      <div
                        key={col.header}
                        className="grid grid-cols-2 px-4 py-2 gap-4"
                      >
                        <span className="paragraph-x-small text-(--text--sub-600) truncate">
                          {col.header}
                        </span>
                        <span className="paragraph-x-small text-foreground truncate text-right">
                          {col.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Multi-sheet tabs: show sub-tab name + row count */}
              {found && !group.showColumns && (
                <div className="divide-y divide-border">
                  {matchingSheets.map((sheet: ParsedSheet) => {
                    const dataRows = Math.max(0, sheet.rows.length - 1);
                    return (
                      <div
                        key={sheet.name}
                        className="flex items-center justify-between px-4 py-2"
                      >
                        <span className="paragraph-x-small text-(--text--sub-600)">
                          {subTabLabel(sheet.name, group.label)}
                        </span>
                        <span className="label-x-small text-(--text--sub-600)">
                          {dataRows} {dataRows === 1 ? "row" : "rows"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Unrecognised sheets */}
        {parsedSheets
          .filter(
            (s) =>
              !TAB_GROUPS.some((g) => matchesGroup(s.name, g.prefixes)) &&
              normalise(s.name) !== "list",
          )
          .map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-(--bg--weak-50)"
            >
              <div className="flex items-center gap-3">
                <Icon
                  name="information-fill"
                  size={16}
                  className="text-(--state--warning--base) shrink-0"
                />
                <span className="paragraph-small text-foreground">{s.name}</span>
              </div>
              <span className="label-x-small text-(--state--warning--base)">
                Unrecognised — will be skipped
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
