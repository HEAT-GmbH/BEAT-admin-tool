"use client";
import { Icon } from "@/components/icon";
import { useEffect } from "react";
import { useSteps } from "./steps.context";

/** Tab names that correspond to API import steps (in order). */
const EXPECTED_TABS = [
  "Building Name and Location",
  "Building Details",
  "Operational Schedule and Temper",
  "Cooling System",
  "Ventilation System",
  "Lightning System",
  "Lift & Escalator System",
  "Hot water System",
  "Operational Energy Carriers",
  "Structural Components",
];

export const MapFields = () => {
  const { parsedSheets, toggleComplete, item } = useSteps();

  // Auto-complete this informational step as soon as it mounts.
  useEffect(() => {
    toggleComplete(item.id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectedNames = parsedSheets.map((s) => s.name);

  /** Match a sheet name against an expected tab prefix (case-insensitive). */
  const matchesTab = (sheetName: string, tab: string) =>
    sheetName.trim().toLowerCase().startsWith(tab.toLowerCase());

  return (
    <div className="size-full space-y-4 flex flex-col">
      <div className="space-y-1 shrink-0">
        <h6 className="h6-title text-foreground">Review Detected Sheets</h6>
        <p className="paragraph-small text-(--text--sub-600)">
          The following sheets were found in your uploaded file. Recognised tabs
          will be imported.
        </p>
      </div>

      {parsedSheets.length === 0 ? (
        <p className="paragraph-small text-(--text--sub-600)">
          No sheets detected. Please go back and re-upload your file.
        </p>
      ) : (
        <div className="w-full flex-1 overflow-auto no-scrollbar space-y-2">
          {EXPECTED_TABS.map((tab) => {
            const matchingSheets = parsedSheets.filter((s) =>
              matchesTab(s.name, tab),
            );
            const found = matchingSheets.length > 0;
            const sheet = matchingSheets[0];
            return (
              <div
                key={tab}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-(--bg--weak-50)"
              >
                <div className="flex items-center gap-3">
                  {found ? (
                    <Icon
                      name="select-box-circle-fill"
                      size={18}
                      className="text-(--state--success--base)"
                    />
                  ) : (
                    <Icon
                      name="close-circle-fill"
                      size={18}
                      className="text-(--text--sub-600) opacity-40"
                    />
                  )}
                  <span
                    className={
                      found
                        ? "paragraph-small text-foreground"
                        : "paragraph-small text-(--text--sub-600) opacity-50"
                    }
                  >
                    {tab}
                  </span>
                </div>
                {found && (
                  <span className="label-x-small text-(--text--sub-600)">
                    {matchingSheets.length > 1
                      ? `${matchingSheets.length} sheets`
                      : sheet
                        ? `${Math.max(0, sheet.rows.length - 1)} row${sheet.rows.length - 1 !== 1 ? "s" : ""}`
                        : ""}
                  </span>
                )}
                {!found && (
                  <span className="label-x-small text-(--text--sub-600) opacity-50">
                    Not found
                  </span>
                )}
              </div>
            );
          })}

          {/* Show any extra/unrecognised sheets */}
          {detectedNames
            .filter(
              (n) =>
                !EXPECTED_TABS.some((t) => matchesTab(n, t)) &&
                n.toLowerCase() !== "list",
            )
            .map((n) => (
              <div
                key={n}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-(--bg--weak-50)"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name="information-fill"
                    size={18}
                    className="text-(--state--warning--base)"
                  />
                  <span className="paragraph-small text-foreground">{n}</span>
                </div>
                <span className="label-x-small text-(--state--warning--base)">
                  Unrecognised — will be skipped
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
