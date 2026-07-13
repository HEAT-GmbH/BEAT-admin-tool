"use client";
import { AddBuildingStepConfig } from "@/models/building";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  TransitionStartFunction,
  useContext,
  useEffect,
  useEffectEvent,
  useTransition,
  useState,
  useRef,
} from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { schema, type AddBuildingForm } from "./schema";
import { STEPS } from "./step-lists";
import { toast } from "sonner";

interface AddBuildingContext {
  stepBadge: { current: number; total: number } | null;
  title: string;
  description: string;
  tip: string | null;
  completed: Record<string, boolean>;
  goBack: () => void;
  skip: () => void;
  next: () => void;
  canSkip: () => boolean;
  canNext: () => boolean;
  activeMainStep: AddBuildingStepConfig | undefined;
  activeSubStep: AddBuildingStepConfig | undefined;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  buildingUuid: string | null;
  setCertFile: (file: File | null) => void;
  setBoqFiles: (files: File[]) => void;
  /** True when the current step requires a UUID but none exists yet */
  missingUuid: boolean;
  /** Called by the building details screen to tell context whether subtypes are available */
  setSubtypesAvailable: (v: boolean) => void;
}

export const AddBuildingContext = createContext<AddBuildingContext | undefined>(
  undefined,
);

export const AddBuildingProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isActive = (main: string, sub?: string) =>
    pathname.startsWith("/add-building" + main + (sub ? sub : ""));
  const activeMainStep = STEPS.find((step) => isActive(step.path));
  const activeSubStep = activeMainStep?.steps?.find((step) =>
    isActive(activeMainStep.path, step.path),
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [buildingUuid, setBuildingUuid] = useState<string | null>(null);
  const buildingUuidRef = useRef<string | null>(null);
  const setUuid = (uuid: string | null) => {
    buildingUuidRef.current = uuid;
    setBuildingUuid(uuid);
  };

  // File state for step 1-2 uploads
  const certFileRef = useRef<File | null>(null);
  const boqFilesRef = useRef<File[]>([]);
  const setCertFile = (file: File | null) => { certFileRef.current = file; };
  const setBoqFiles = (files: File[]) => { boqFilesRef.current = files; };

  // Whether the currently selected building type has subtypes (set by the details screen)
  const subtypesAvailableRef = useRef(false);
  const setSubtypesAvailable = (v: boolean) => { subtypesAvailableRef.current = v; };

  const { handleSubmit, control, getValues, reset, ...methods } = useForm<AddBuildingForm>({
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
  });

  // Pre-populate form from detail API when we have a UUID
  const populateFromDetail = async (uuid: string) => {
    try {
      const res = await fetch(`/api/buildings/${uuid}/detail`);
      if (!res.ok) return;
      const d = await res.json();
      const core = d.core ?? d;
      const sched = d.schedule ?? {};
      reset({
        ...getValues(),
        buildingInformation: {
          buildingNameLocation: {
            nameOrCode: core.name ?? "",
            address: core.street ?? "",
            country: String(core.country?.id ?? ""),
            region: String(core.region?.id ?? ""),
            city: String(core.city?.id ?? ""),
            longitude: core.longitude != null ? String(core.longitude) : "",
            latitude: core.latitude != null ? String(core.latitude) : "",
          },
          buildingDetails: {
            buildingTypeId: String(core.category?.category_id ?? ""),
            apartmentTypeId: core.category?.subcategory_id ? String(core.category.subcategory_id) : undefined,
            climateTypeId: core.climate_zone?.name ?? "",
            assessmentPeriod: core.reference_period ?? undefined,
            constructionYear: core.construction_year ? String(core.construction_year) : undefined,
            totalFloorArea: core.total_floor_area ? Number(core.total_floor_area) : undefined,
            conditionedFloorArea: core.cond_floor_area ? Number(core.cond_floor_area) : undefined,
            numberOfFloorsBelowGround: core.floors_below_ground ?? undefined,
            hasCertification: core.has_certification ? "yes" : "no",
            hasBOQ: core.has_boq ? "yes" : "no",
          },
        },
        operationalDetails: {
          ...getValues().operationalDetails,
          operationalScheduleTemperature: {
            numberOfResidents: sched.num_residents ?? undefined,
            annualOperatingSchedule: {
              hours: sched.hours_per_workday ?? undefined,
              days: sched.workdays_per_week ?? undefined,
              weeks: sched.weeks_per_year ?? undefined,
            },
            roomHeatingTemperature: sched.heating_temp ?? undefined,
            heatingTemperatureUnit: sched.heating_temp_unit ?? "celsius",
            roomCoolingTemperature: sched.cooling_temp ?? undefined,
            coolingTemperatureUnit: sched.cooling_temp_unit ?? "celsius",
            renewableEnergyPercent: sched.renewable_energy_percent ?? undefined,
            buildingSmartSystem: sched.building_smart_system ? "yes" : "no",
          },
        },
      });
    } catch {
      // silently ignore — form stays empty
    }
  };

  // On mount: if ?uuid= is in the URL (navigating back / deep-linking), restore state
  useEffect(() => {
    const uuid = searchParams.get("uuid");
    if (uuid) {
      setUuid(uuid);
      populateFromDetail(uuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uuidParam = buildingUuidRef.current ? `?uuid=${buildingUuidRef.current}` : "";

  const goBack = () => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id > 1) {
        path +=
          activeMainStep.path +
          activeMainStep.steps?.[activeSubStep.id - 2].path;
      } else {
        if (activeMainStep.id === 1) {
          startTransition(() => {
            router.back();
          });
          return;
        } else {
          const nextMain = STEPS[activeMainStep.id - 2];
          if (!nextMain.steps) {
            path += nextMain.path;
          } else {
            path +=
              nextMain.path + nextMain.steps[nextMain.steps.length - 1].path;
          }
        }
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id > 1) {
        path += STEPS[activeMainStep.id - 2].path;
      } else {
        startTransition(() => {
          router.back();
        });
        return;
      }
    }
    startTransition(() => {
      router.push(path + uuidParam);
    });
  };

  const skip = () => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id < activeMainStep.steps!.length) {
        path +=
          activeMainStep.path + activeMainStep.steps?.[activeSubStep.id].path;
      } else {
        if (activeMainStep.id < STEPS.length + 1) {
          path += STEPS[activeMainStep.id].path;
        } else return;
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id < STEPS.length + 1) {
        path += STEPS[activeMainStep.id].path;
      } else {
        startTransition(() => {
          router.back();
        });
        return;
      }
    }
    startTransition(() => {
      router.push(path + uuidParam);
    });
  };

  /**
   * Returns the next path to navigate to (with ?uuid= appended if we have one).
   */
  const getNextPath = (): string | null => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id < activeMainStep.steps!.length) {
        path += activeMainStep.path + activeMainStep.steps?.[activeSubStep.id].path;
      } else {
        if (activeMainStep.id < STEPS.length + 1) {
          path += STEPS[activeMainStep.id].path;
        } else return null;
      }
    } else if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id < STEPS.length + 1) {
        path += STEPS[activeMainStep.id].path;
      } else return null;
    }
    const uuid = buildingUuidRef.current ?? buildingUuid;
    if (uuid) path += `?uuid=${uuid}`;
    return path;
  };

  /**
   * Call the appropriate API endpoint for the current step.
   * Returns true to navigate, false to block (only for steps 1-1 and 1-2).
   */
  const callStepApi = async (): Promise<boolean> => {
    if (!activeMainStep) return true;

    // Steps without sub-steps (steps 3 and 4) — fire-and-forget
    if (!activeSubStep) {
      if (activeMainStep.id === 3) {
        if (!buildingUuid) return true;
        const entries = getValues().operationalDataEntry ?? [];
        try {
          await fetch("/api/buildings/add/energy-carriers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: buildingUuid,
              products: entries.map((e) => ({
                epd_id: e.id,
                quantity: e.quantity,
                input_unit: e.unit,
                description: e.description ?? "",
              })),
            }),
          });
        } catch (err) {
          console.error("[add/energy-carriers] network error:", err);
        }
        return true;
      }

      if (activeMainStep.id === 4) {
        if (!buildingUuid) return true;
        const components = getValues().buildingStructuralComponents ?? [];
        for (const comp of components) {
          if (comp.id) continue;
          try {
            if (comp.type === "component") {
              const unit = comp.unit;
              const dimension = unit === "m2" ? "area" : unit === "m3" ? "volume" : unit === "m" ? "length" : unit === "kg" || unit === "ton" ? "mass" : "pieces";
              await fetch("/api/buildings/add/structural-components", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  building_uuid: buildingUuid,
                  title: comp.title,
                  dimension,
                  quantity: comp.quantity,
                  unit: comp.unit,
                  comment: comp.comment ?? undefined,
                  materials: (comp.materials ?? []).map((m) => ({
                    epd_id: m.id,
                    quantity: m.quantity,
                    input_unit: m.unit,
                  })),
                }),
              });
            }
          } catch (err) {
            console.error("[add/structural-components] network error:", err);
          }
        }
        return true;
      }

      return true;
    }

    const values = getValues();

    // Step 1.1 — Building Name & Location (blocking)
    if (activeMainStep.id === 1 && activeSubStep.id === 1) {
      const loc = values.buildingInformation?.buildingNameLocation;
      if (!loc) return true;

      try {
        const res = await fetch("/api/buildings/add/name-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_name: loc.nameOrCode,
            address: loc.address,
            country: loc.country,
            region: loc.region,
            city: loc.city,
            longitude: loc.longitude || undefined,
            latitude: loc.latitude || undefined,
            ...(buildingUuid ? { building_uuid: buildingUuid } : {}),
          }),
        });

        if (res.ok) {
          const data = await res.json().catch(() => null);
          const uuid: string | null = data?.building_uuid ?? data?.uuid ?? null;
          if (uuid) {
            setUuid(uuid);
            // Persist UUID in URL so it survives navigation / refresh
            const next = getNextPath();
            if (next) {
              startTransition(() => {
                router.push(`${next}?uuid=${uuid}`);
              });
              return false; // we handled navigation ourselves
            }
            toast.success("Building location saved.");
          }
          return true;
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err?.detail ?? err?.building_name?.[0] ?? "Failed to save building location.");
          return false;
        }
      } catch {
        toast.error("Network error. Please try again.");
        return false;
      }
    }

    // Step 1.2 — Building Details (blocking)
    if (activeMainStep.id === 1 && activeSubStep.id === 2) {
      if (!buildingUuid) {
        toast.error("No building found. Please complete step 1 first.");
        return false;
      }
      const details = values.buildingInformation?.buildingDetails;
      if (!details) return true;

      if (subtypesAvailableRef.current && !details.apartmentTypeId) {
        toast.error("Please select a type of apartments.");
        return false;
      }

      // Upload files first — if they fail, don't save details
      const certFile = certFileRef.current;
      const boqFiles = boqFilesRef.current;
      const hasCert = details.hasCertification === "yes";
      const hasBoq = details.hasBOQ === "yes";

      if (hasCert || hasBoq) {
        const fd = new FormData();
        fd.append("building_uuid", buildingUuid);
        fd.append("has_certification", hasCert ? "yes" : "no");
        fd.append("has_boq", hasBoq ? "yes" : "no");
        if (hasCert && certFile) fd.append("certification_file", certFile);
        if (hasBoq) boqFiles.forEach((f) => fd.append("boq_files", f));

        try {
          const fileRes = await fetch("/api/buildings/files", {
            method: "POST",
            body: fd,
          });
          if (!fileRes.ok) {
            const err = await fileRes.json().catch(() => ({}));
            toast.error(err?.error ?? "Failed to upload files. Please try again.");
            return false;
          }
        } catch {
          toast.error("File upload failed. Please try again.");
          return false;
        }
      }

      // Files succeeded (or not required) — now save details
      try {
        const res = await fetch("/api/buildings/add/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_uuid: buildingUuid,
            building_type_id: details.buildingTypeId,
            apartment_type_id: details.apartmentTypeId ?? undefined,
            climate_type: details.climateTypeId,
            assessment_period: details.assessmentPeriod,
            total_floor_area: details.totalFloorArea,
            conditioned_floor_area: details.conditionedFloorArea ?? undefined,
            construction_year: details.constructionYear ?? undefined,
            floors_below_ground: details.numberOfFloorsBelowGround ?? undefined,
            has_certification: details.hasCertification === "yes",
            has_boq: details.hasBOQ === "yes",
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          toast.error(err?.detail ?? "Failed to save building details.");
          return false;
        }

        toast.success("Building details saved.");
      } catch {
        toast.error("Network error. Please try again.");
        return false;
      }

      return true;
    }

    // Steps 2.x — fire-and-forget
    if (activeMainStep.id === 2 && activeSubStep.id === 1) {
      if (!buildingUuid) return true;
      const sched = values.operationalDetails?.operationalScheduleTemperature;
      if (!sched) return true;
      try {
        await fetch("/api/buildings/add/operational-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_uuid: buildingUuid,
            num_residents: sched.numberOfResidents,
            hours_per_workday: sched.annualOperatingSchedule?.hours,
            workdays_per_week: sched.annualOperatingSchedule?.days,
            weeks_per_year: sched.annualOperatingSchedule?.weeks,
            heating_temp: sched.roomHeatingTemperature,
            heating_temp_unit: sched.heatingTemperatureUnit,
            cooling_temp: sched.roomCoolingTemperature,
            cooling_temp_unit: sched.coolingTemperatureUnit,
            renewable_energy_percent: sched.renewableEnergyPercent ?? undefined,
            building_smart_system: sched.buildingSmartSystem === "yes",
          }),
        });
      } catch (err) {
        console.error("[add/operational-schedule] network error:", err);
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 2) {
      if (!buildingUuid) return true;
      const systems = values.operationalDetails?.coolingSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          if (system.type === "chiller") {
            const c = system as import("./schema").ChillerSystem;
            await fetch("/api/buildings/add/cooling-systems", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                building_uuid: buildingUuid,
                cooling_system_type: "chiller",
                chiller_system: c.chillerType,           // water-cooled / air-cooled
                type_of_refrigerants: c.refrigerantType,
                refrigerant_quantity: c.refrigerantQuantity,
                total_cooling_load: c.totalCoolingLoad,
                number_of_chillers: c.numberOfChillers,
                baseline_leakage_factor: c.baselineLeakageFactor,
                annual_operating_hours_per_day: c.operatingSchedule?.hours,
                annual_operating_days_per_week: c.operatingSchedule?.days,
                annual_operating_weeks_per_year: c.operatingSchedule?.weeks,
                baseline_cooling_efficiency: c.baselineCoolingEfficiency,
                installation_of_variable_speed_drives: c.installationOfVariableSpeedDrives ? "yes" : "no",
                installation_of_heat_recovery_systems: c.installationOfHeatRecoverySystems ? "yes" : "no",
                ipvl: c.iplv ?? undefined,
                water_cooled_chiller_cooling_load_factor: c.waterCooledChillerCoolingLoadFactor ?? undefined,
                total_chiller_system_power_input: c.totalChillerSystemPowerInput ?? undefined,
                cop: c.cop ?? undefined,
                energy_efficiency_label: c.energyEfficiencyLabel ?? undefined,
                number_of_stars: c.numberOfStars ?? undefined,
                // auto-calculated on backend; omit from payload (backend recalculates)
              }),
            });
          } else {
            const ac = system as import("./schema").AirConditionSystem;
            await fetch("/api/buildings/add/cooling-systems", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                building_uuid: buildingUuid,
                cooling_system_type: "air_conditioner",
                type_of_air_condition: ac.acType,        // window / split / vrv / packaged
                packaged_subtype: ac.packagedSubtype ?? undefined,
                year_of_installation: ac.yearOfInstallation,
                type_of_refrigerants: ac.refrigerantType,
                refrigerant_quantity: ac.refrigerantQuantity,
                cooling_capacity_per_unit: ac.coolingCapacityPerUnit,
                cooling_capacity_unit: ac.coolingCapacityUnit,
                number_of_units: ac.numberOfUnits,
                baseline_leakage_factor: ac.baselineLeakageFactor,
                hours_per_day: ac.operatingSchedule?.hours,
                days_per_week: ac.operatingSchedule?.days,
                weeks_per_year: ac.operatingSchedule?.weeks,
                eer_iseer_cop: ac.eerIseerCop,
                power_input_per_unit: ac.powerInputPerUnit ?? undefined,
                energy_efficiency_label: ac.energyEfficiencyLabel ?? undefined,
                number_of_stars: ac.numberOfStars ?? undefined,
                // auto-calculated on backend; omit from payload
              }),
            });
          }
        } catch (err) {
          console.error("[add/cooling-systems] network error:", err);
        }
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 3) {
      if (!buildingUuid) return true;
      const systems = values.operationalDetails?.ventilationSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          await fetch("/api/buildings/add/ventilation-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: buildingUuid,
              ventilation_type: system.type,
              capacity_unit: system.capacityUnit,
              baseline_efficiency: system.baselineEfficiency,
              total_power_input: system.totalPowerInput,
              air_flow_rate: system.airFlowRate,
              installation_of_demand_controlled_ventilation: system.installationOfDemandControlledVentilation,
              installation_of_variable_speed_drives: system.installationOfVariableSpeedDrives,
              total_number_of_ventilation_type_installed: system.totalNumberOfVentilationTypeInstalled,
              total_energy_consumption_annually: system.totalEnergyConsumptionAnnually,
              energy_efficiency_label: system.energyEfficiencyLabel,
              number_of_stars: system.numberOfStars,
            }),
          });
        } catch (err) {
          console.error("[add/ventilation-systems] network error:", err);
        }
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 4) {
      if (!buildingUuid) return true;
      const systems = values.operationalDetails?.lightingSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          await fetch("/api/buildings/add/lighting-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: buildingUuid,
              lighting_type: system.type,
              room_area: system.roomArea,
              light_bulb_type: system.lightBulbType,
              number_of_lighting_bulbs: system.numberOfLightingBulbs,
              lighting_bulb_power_rating: system.lightingBulbPowerRating,
              installation_of_sensors: system.installationOfSensors,
              baseline_lighting_power_density: system.baselineLightingPowerDensity,
              total_energy_consumption_annually: system.totalEnergyConsumptionAnnually,
              energy_efficiency_label: system.energyEfficiencyLabel,
              number_of_stars: system.numberOfStars,
              hours_per_workday: system.systemOperatingSchedule?.hours,
              workdays_per_week: system.systemOperatingSchedule?.days,
              weeks_per_year: system.systemOperatingSchedule?.weeks,
            }),
          });
        } catch (err) {
          console.error("[add/lighting-systems] network error:", err);
        }
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 5) {
      if (!buildingUuid) return true;
      const systems = values.operationalDetails?.liftEscalatorSystem ?? [];
      const first = systems[0];
      if (!first || first.id) return true;
      try {
        await fetch("/api/buildings/add/lift-escalator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_uuid: buildingUuid,
            number_of_lifts: first.numberOfLifts,
            installation_of_lift_regenerative_features: first.installationOfLiftRegenerativeFeatures,
            installation_of_vvvf_and_sleep_mode: first.installationOfVVVFAndSleepMode,
            annual_energy_consumption: first.annualEnergyConsumption ?? undefined,
          }),
        });
      } catch (err) {
        console.error("[add/lift-escalator] network error:", err);
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 6) {
      if (!buildingUuid) return true;
      const systems = values.operationalDetails?.hotWaterSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          await fetch("/api/buildings/add/hot-water-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: buildingUuid,
              hot_water_system_type: system.type,
              fuel_type: system.fuelType,
              fuel_consumption: system.fuelConsumption,
              power_input: system.powerInput,
              baseline_efficiency: system.baselineEfficiency,
              baseline_equipment_efficiency_level: system.baselineEquipmentEfficiencyLevel,
              installation_of_heat_recovery_system: system.installationOfHeatRecoverySystem,
              number_of_equipment: system.numberOfEquipment,
              energy_efficiency_label: system.energyEfficiencyLabel,
              number_of_stars: system.numberOfStars,
              hours_per_workday: system.systemOperatingSchedule?.hours,
              workdays_per_week: system.systemOperatingSchedule?.days,
              weeks_per_year: system.systemOperatingSchedule?.weeks,
            }),
          });
        } catch (err) {
          console.error("[add/hot-water-systems] network error:", err);
        }
      }
      return true;
    }

    return true;
  };

  const isStep = (mainId: number, subId?: number) =>
    activeMainStep?.id === mainId && (subId === undefined || activeSubStep?.id === subId);

  const next = () => {
    const nextPath = getNextPath();
    if (!nextPath) {
      handleSubmit(onSubmit)();
      return;
    }

    // Steps 1-1 and 1-2 are blocking — await before navigating
    if (isStep(1, 1) || isStep(1, 2)) {
      callStepApi().then((ok) => {
        if (!ok) return;
        // Recompute path after API call so buildingUuid is definitely current
        const path = getNextPath() ?? nextPath;
        startTransition(() => { router.push(path); });
      });
      return;
    }

    // All other steps — fire-and-forget
    callStepApi().finally(() => {
      const path = getNextPath() ?? nextPath;
      startTransition(() => { router.push(path); });
    });
  };

  const canSkip = (): boolean => {
    // Steps 1-1 and 1-2 cannot be skipped
    if (isStep(1, 1) || isStep(1, 2)) return false;

    if (activeSubStep) {
      return activeSubStep.id < activeMainStep!.steps!.length + 1;
    } else if (activeMainStep && !activeSubStep) {
      return activeMainStep.id < STEPS.length + 1;
    }
    return false;
  };

  const canNext = (): boolean => {
    if (activeSubStep) {
      return (
        completed[`${activeMainStep!.id}-${activeSubStep.id}`] &&
        activeSubStep.id < activeMainStep!.steps!.length + 1
      );
    } else if (activeMainStep && !activeSubStep) {
      return (
        completed[`${activeMainStep.id}`] &&
        activeMainStep.id < STEPS.length + 1
      );
    }
    return false;
  };

  const buildingInformation = useWatch({
    control,
    name: "buildingInformation",
  });
  const operationalDetails = useWatch({
    control,
    name: "operationalDetails",
  });

  const completed: Record<string, boolean> = {
    "1": !!schema.shape.buildingInformation.safeParse(buildingInformation).success,
    "1-1": !!schema.shape.buildingInformation.shape.buildingNameLocation.safeParse(buildingInformation?.buildingNameLocation).success,
    "1-2": !!schema.shape.buildingInformation.shape.buildingDetails.safeParse(buildingInformation?.buildingDetails).success,
    "2": !!schema.shape.operationalDetails.safeParse(operationalDetails).success,
    "2-1": !!schema.shape.operationalDetails.shape.operationalScheduleTemperature.safeParse(operationalDetails?.operationalScheduleTemperature).success,
    "2-2": !!schema.shape.operationalDetails.shape.coolingSystem.safeParse(operationalDetails?.coolingSystem).success,
    "2-3": !!schema.shape.operationalDetails.shape.ventilationSystem.safeParse(operationalDetails?.ventilationSystem).success,
    "2-4": !!schema.shape.operationalDetails.shape.lightingSystem.safeParse(operationalDetails?.lightingSystem).success,
    "2-5": !!schema.shape.operationalDetails.shape.liftEscalatorSystem.safeParse(operationalDetails?.liftEscalatorSystem).success,
    "2-6": !!schema.shape.operationalDetails.shape.hotWaterSystem.safeParse(operationalDetails?.hotWaterSystem).success,
  };

  const onSubmit = async (data: AddBuildingForm) => {
    console.log("Final form data:", data);

    if (!buildingUuid) {
      console.warn("No building UUID — cannot call complete.");
      return;
    }

    try {
      const res = await fetch("/api/buildings/add/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ building_uuid: buildingUuid }),
      });

      if (res.ok) {
        router.push("/buildings");
      } else {
        console.error("[add/complete] failed:", res.status);
      }
    } catch (err) {
      console.error("[add/complete] network error:", err);
    }
  };

  const prefetchEvent = useEffectEvent(() => {
    STEPS.forEach((step) => {
      if (step.steps) {
        step.steps.forEach((subStep) => {
          router.prefetch(step.path + subStep.path);
        });
      }
      router.prefetch(step.path);
    });
  });

  useEffect(() => {
    prefetchEvent();
  }, []);

  return (
    <AddBuildingContext.Provider
      value={{
        stepBadge: activeSubStep
          ? {
              current: activeSubStep.id,
              total: activeMainStep?.steps?.length || 0,
            }
          : null,
        title: activeSubStep
          ? activeSubStep.title || activeSubStep.label
          : activeMainStep?.title || "",
        description: activeSubStep
          ? activeSubStep.description
          : activeMainStep?.description || "",
        tip: activeSubStep
          ? activeSubStep.tip || null
          : activeMainStep?.tip || null,
        completed,
        goBack,
        skip,
        next,
        canSkip,
        canNext,
        activeMainStep,
        activeSubStep,
        isPending,
        startTransition,
        buildingUuid,
        setCertFile,
        setBoqFiles,
        // Step 1-1 is the only step that doesn't need a UUID yet
        missingUuid: !buildingUuid && !(activeMainStep?.id === 1 && activeSubStep?.id === 1),
        setSubtypesAvailable,
      }}
    >
      <FormProvider handleSubmit={handleSubmit} control={control} getValues={getValues} reset={reset} {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {children}
        </form>
      </FormProvider>
    </AddBuildingContext.Provider>
  );
};

export const useAddBuilding = () => {
  const context = useContext(AddBuildingContext);
  if (!context) {
    throw new Error("useAddBuilding must be used within AddBuildingProvider");
  }
  return context;
};
