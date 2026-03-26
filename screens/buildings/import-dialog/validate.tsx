"use client";
import { Icon } from "@/components/icon";
import { useEffect, useState } from "react";
import { useSteps } from "./steps.context";

/**
 * Extracts a value from a row using a header row for column lookup.
 * Returns null if not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getField(headers: any[], row: any[], ...keys: string[]): string | null {
  for (const key of keys) {
    const idx = headers.findIndex(
      (h: unknown) =>
        typeof h === "string" && h.trim().toLowerCase() === key.toLowerCase(),
    );
    if (idx !== -1 && row[idx] !== null && row[idx] !== undefined) {
      return String(row[idx]);
    }
  }
  return null;
}

export const Validate = () => {
  const {
    parsedSheets,
    organisationId,
    setBuildingUuid,
    toggleComplete,
    item,
  } = useSteps();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultUuid, setResultUuid] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setStatus("loading");
      setErrorMessage(null);

      // Find "Building Name and Location" sheet (case-insensitive).
      const sheet = parsedSheets.find(
        (s) => s.name.trim().toLowerCase().startsWith("building name and location"),
      );

      if (!sheet || sheet.rows.length < 2) {
        setStatus("error");
        setErrorMessage(
          "Could not find a 'Building Name and Location' sheet with data rows in your file.",
        );
        return;
      }

      const headers = sheet.rows[0];
      const dataRow = sheet.rows[1];

      const payload: Record<string, string | undefined> = {
        building_name:
          getField(headers, dataRow, "building name or code", "building_name", "name") ??
          undefined,
        address:
          getField(headers, dataRow, "address (zip, street)", "address", "building_address") ?? undefined,
        country:
          getField(headers, dataRow, "country", "country of building") ?? undefined,
        region:
          getField(headers, dataRow, "region or state", "region", "region_state", "state") ?? undefined,
        city:
          getField(headers, dataRow, "city", "building_city") ?? undefined,
        longitude:
          getField(headers, dataRow, "longitude (optional)", "longitude", "building_longitude") ?? undefined,
        latitude:
          getField(headers, dataRow, "latitude (optional)", "latitude", "building_latitude") ?? undefined,
        organisation_id: organisationId ?? undefined,
      };

      // Remove undefined keys.
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined),
      );

      try {
        const res = await fetch("/api/buildings/import/name-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanPayload),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(
            data?.detail ?? data?.message ?? `Request failed (${res.status})`,
          );
          return;
        }

        const uuid: string = data?.building_uuid ?? data?.uuid ?? null;
        setResultUuid(uuid);
        setBuildingUuid(uuid);
        setStatus("success");
        toggleComplete(item.id, true);
      } catch (err) {
        console.error("[import/name-location]", err);
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="size-full flex flex-col items-center justify-center gap-6 p-4">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full size-23 bg-(--bg--weak-50) shrink-0 grid place-items-center">
            <Icon
              name="information-fill"
              size={56}
              className="text-(--state--information--base)"
            />
          </div>
          <p className="label-small text-foreground">
            Submitting name &amp; location…
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4 text-center w-full max-w-sm">
          <div className="rounded-full size-23 bg-(--state--success--lighter) shrink-0 grid place-items-center">
            <Icon
              name="select-box-circle-fill"
              size={56}
              className="text-(--state--success--base)"
            />
          </div>
          <h6 className="h6-title text-foreground">Name &amp; Location saved</h6>
          <p className="paragraph-small text-(--text--sub-600)">
            Building created successfully. Click "Process and import" to continue
            importing the remaining data.
          </p>
          {resultUuid && (
            <div className="bg-(--bg--weak-50) rounded-lg px-4 py-3 w-full text-left">
              <span className="paragraph-x-small text-(--text--sub-600)">
                Building UUID
              </span>
              <p className="label-small text-foreground break-all">{resultUuid}</p>
            </div>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4 text-center w-full max-w-sm">
          <div className="rounded-full size-23 bg-(--state--error--lighter) shrink-0 grid place-items-center">
            <Icon
              name="close-circle-fill"
              size={56}
              className="text-(--state--error--base)"
            />
          </div>
          <h6 className="h6-title text-foreground">Import failed</h6>
          {errorMessage && (
            <p className="paragraph-small text-(--state--error--base)">
              {errorMessage}
            </p>
          )}
          <p className="paragraph-small text-(--text--sub-600)">
            Please check your file and try again.
          </p>
        </div>
      )}
    </div>
  );
};
