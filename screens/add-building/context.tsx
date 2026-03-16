"use client";
import { AddBuildingStepConfig } from "@/models/building";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  TransitionStartFunction,
  useContext,
  useEffect,
  useEffectEvent,
  useTransition,
  useState,
} from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { schema, type AddBuildingForm } from "./schema";
import { STEPS } from "./step-lists";

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
  /** UUID of the building created via the API during the add flow. */
  buildingUuid: string | null;
}

const AddBuildingContext = createContext<AddBuildingContext | undefined>(
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
  const [isPending, startTransition] = useTransition();
  const [buildingUuid, setBuildingUuid] = useState<string | null>(null);

  const { handleSubmit, control, getValues, ...methods } = useForm<AddBuildingForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

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
      router.push(path);
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
      router.push(path);
    });
  };

  /**
   * Call the appropriate API endpoint for the current step before navigating.
   */
  const callStepApi = async (): Promise<boolean> => {
    if (!activeMainStep) return true;
    // Main steps without sub-steps (steps 3 and 4)
    if (!activeSubStep) {
      // Step 3 — Operational Data Entry (Energy Carriers)
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

      // Step 4 — Building Structural Components
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

    // Step 1.1 — Building Name & Location
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
          const uuid: string | null =
            data?.building_uuid ?? data?.uuid ?? null;
          if (uuid) setBuildingUuid(uuid);
        } else {
          console.error(
            "[add/name-location] failed:",
            res.status,
            await res.text().catch(() => ""),
          );
        }
      } catch (err) {
        console.error("[add/name-location] network error:", err);
      }
      return true;
    }

    // Step 1.2 — Building Details
    if (activeMainStep.id === 1 && activeSubStep.id === 2) {
      if (!buildingUuid) return true;
      const details = values.buildingInformation?.buildingDetails;
      if (!details) return true;

      try {
        const res = await fetch("/api/buildings/add/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_uuid: buildingUuid,
            building_type_id: details.type,
            climate_type: details.areaClimateType,
            assessment_period: details.assessmentPeriod,
            total_floor_area: details.totalFloorArea,
            conditioned_floor_area: details.conditionedFloorArea ?? undefined,
            construction_year: details.constructionYear ?? undefined,
            floors_below_ground: details.numberOfFloorsBelowGround ?? undefined,
          }),
        });

        if (!res.ok) {
          console.error(
            "[add/details] failed:",
            res.status,
            await res.text().catch(() => ""),
          );
        }
      } catch (err) {
        console.error("[add/details] network error:", err);
      }
      return true;
    }

    // Step 2.1 — Operational Schedule & Temperature
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
            cooling_temp: sched.roomCoolingTemperature,
          }),
        });
      } catch (err) {
        console.error("[add/operational-schedule] network error:", err);
      }
      return true;
    }

    // Step 2.2 — Cooling Systems
    if (activeMainStep.id === 2 && activeSubStep.id === 2) {
      if (!buildingUuid) return true;
      const systems = values.operationalDetails?.coolingSystem ?? [];

      for (const system of systems) {
        if (system.id) continue; // already saved
        try {
          const isChiller = system.type === "chiller";
          const d = system.data as Record<string, unknown>;
          await fetch("/api/buildings/add/cooling-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: buildingUuid,
              cooling_system_type: isChiller ? "chiller" : "air_conditioner",
              refrigerant_type: d.refrigerantType,
              refrigerant_quantity: d.refrigerantQuantity,
              total_cooling_load: d.totalCoolingLoad,
              baseline_cooling_efficiency: d.baselineCoolingEfficiency,
              baseline_leakage_factor: d.baselineLeakageFactor,
              installation_of_heat_recovery_systems: d.installationOfHeatRecoverySystems,
              installation_of_variable_speed_drives: d.installationOfVariableSpeedDrives,
              year_of_installation: d.yearOfInstallation,
              ...(isChiller ? {} : {}),
            }),
          });
        } catch (err) {
          console.error("[add/cooling-systems] network error:", err);
        }
      }
      return true;
    }

    // Step 2.3 — Ventilation Systems
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

    // Step 2.4 — Lighting Systems
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

    // Step 2.5 — Lift & Escalator System
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

    // Step 2.6 — Hot Water Systems
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

  const next = () => {
    let path = "/add-building";
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id < activeMainStep.steps!.length) {
        path +=
          activeMainStep.path + activeMainStep.steps?.[activeSubStep.id].path;
      } else {
        if (activeMainStep.id < STEPS.length + 1) {
          path += STEPS[activeMainStep.id].path;
        } else {
          handleSubmit(onSubmit)();
          return;
        }
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id < STEPS.length + 1) {
        path += STEPS[activeMainStep.id].path;
      } else {
        handleSubmit(onSubmit)();
        return;
      }
    }

    // Fire-and-forget API call, then navigate.
    callStepApi().finally(() => {
      startTransition(() => {
        router.push(path);
      });
    });
  };

  const canSkip = (): boolean => {
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
    "1": !!schema.shape.buildingInformation.safeParse(buildingInformation)
      .success,
    "1-1":
      !!schema.shape.buildingInformation.shape.buildingNameLocation.safeParse(
        buildingInformation?.buildingNameLocation,
      ).success,
    "1-2": !!schema.shape.buildingInformation.shape.buildingDetails.safeParse(
      buildingInformation?.buildingDetails,
    ).success,
    "2": !!schema.shape.operationalDetails.safeParse(operationalDetails)
      .success,
    "2-1":
      !!schema.shape.operationalDetails.shape.operationalScheduleTemperature.safeParse(
        operationalDetails?.operationalScheduleTemperature,
      ).success,
    "2-2": !!schema.shape.operationalDetails.shape.coolingSystem.safeParse(
      operationalDetails?.coolingSystem,
    ).success,
    "2-3": !!schema.shape.operationalDetails.shape.ventilationSystem.safeParse(
      operationalDetails?.ventilationSystem,
    ).success,
    "2-4": !!schema.shape.operationalDetails.shape.lightingSystem.safeParse(
      operationalDetails?.lightingSystem,
    ).success,
    "2-5":
      !!schema.shape.operationalDetails.shape.liftEscalatorSystem.safeParse(
        operationalDetails?.liftEscalatorSystem,
      ).success,
    "2-6": !!schema.shape.operationalDetails.shape.hotWaterSystem.safeParse(
      operationalDetails?.hotWaterSystem,
    ).success,
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
      }}
    >
      <FormProvider handleSubmit={handleSubmit} control={control} getValues={getValues} {...methods}>
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
