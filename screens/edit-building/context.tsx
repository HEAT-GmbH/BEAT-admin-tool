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
import { schema, type AddBuildingForm } from "@/screens/add-building/schema";
import { STEPS } from "@/screens/add-building/step-lists";

interface EditBuildingContext {
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
  buildingUuid: string;
}

const EditBuildingContext = createContext<EditBuildingContext | undefined>(undefined);

export const EditBuildingProvider = ({
  children,
  editBuildingId,
}: PropsWithChildren<{ editBuildingId: string }>) => {
  const pathname = usePathname();
  const basePath = `/buildings/${editBuildingId}/edit`;
  const isActive = (main: string, sub?: string) =>
    pathname.startsWith(basePath + main + (sub ? sub : ""));
  const activeMainStep = STEPS.find((step) => isActive(step.path));
  const activeSubStep = activeMainStep?.steps?.find((step) =>
    isActive(activeMainStep.path, step.path),
  );

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { handleSubmit, control, getValues, ...methods } = useForm<AddBuildingForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const goBack = () => {
    let path = basePath;
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id > 1) {
        path += activeMainStep.path + activeMainStep.steps?.[activeSubStep.id - 2].path;
      } else {
        if (activeMainStep.id === 1) {
          startTransition(() => { router.push("/buildings"); });
          return;
        } else {
          const prevMain = STEPS[activeMainStep.id - 2];
          if (!prevMain.steps) {
            path += prevMain.path;
          } else {
            path += prevMain.path + prevMain.steps[prevMain.steps.length - 1].path;
          }
        }
      }
    }
    if (!activeSubStep && activeMainStep) {
      if (activeMainStep.id > 1) {
        path += STEPS[activeMainStep.id - 2].path;
      } else {
        startTransition(() => { router.push("/buildings"); });
        return;
      }
    }
    startTransition(() => { router.push(path); });
  };

  const skip = () => {
    let path = basePath;
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id < activeMainStep.steps!.length) {
        path += activeMainStep.path + activeMainStep.steps?.[activeSubStep.id].path;
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
        startTransition(() => { router.back(); });
        return;
      }
    }
    startTransition(() => { router.push(path); });
  };

  const callStepApi = async (): Promise<boolean> => {
    if (!activeMainStep) return true;

    if (!activeSubStep) {
      if (activeMainStep.id === 3) {
        const entries = getValues().operationalDataEntry ?? [];
        try {
          await fetch("/api/buildings/add/energy-carriers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: editBuildingId,
              products: entries.map((e) => ({
                epd_id: e.id,
                quantity: e.quantity,
                input_unit: e.unit,
                description: e.description ?? "",
              })),
            }),
          });
        } catch (err) {
          console.error("[edit/energy-carriers] network error:", err);
        }
        return true;
      }

      if (activeMainStep.id === 4) {
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
                  building_uuid: editBuildingId,
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
            console.error("[edit/structural-components] network error:", err);
          }
        }
        return true;
      }

      return true;
    }

    const values = getValues();

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
            building_uuid: editBuildingId,
          }),
        });
        if (!res.ok) {
          console.error("[edit/name-location] failed:", res.status, await res.text().catch(() => ""));
        }
      } catch (err) {
        console.error("[edit/name-location] network error:", err);
      }
      return true;
    }

    if (activeMainStep.id === 1 && activeSubStep.id === 2) {
      const details = values.buildingInformation?.buildingDetails;
      if (!details) return true;
      try {
        const res = await fetch("/api/buildings/add/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_uuid: editBuildingId,
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
          console.error("[edit/details] failed:", res.status, await res.text().catch(() => ""));
        }
      } catch (err) {
        console.error("[edit/details] network error:", err);
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 1) {
      const sched = values.operationalDetails?.operationalScheduleTemperature;
      if (!sched) return true;
      try {
        await fetch("/api/buildings/add/operational-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_uuid: editBuildingId,
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
        console.error("[edit/operational-schedule] network error:", err);
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 2) {
      const systems = values.operationalDetails?.coolingSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          const isChiller = system.type === "chiller";
          const d = system.data as Record<string, unknown>;
          await fetch("/api/buildings/add/cooling-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: editBuildingId,
              cooling_system_type: isChiller ? "chiller" : "air_conditioner",
              refrigerant_type: d.refrigerantType,
              refrigerant_quantity: d.refrigerantQuantity,
              total_cooling_load: d.totalCoolingLoad,
              baseline_cooling_efficiency: d.baselineCoolingEfficiency,
              baseline_leakage_factor: d.baselineLeakageFactor,
              installation_of_heat_recovery_systems: d.installationOfHeatRecoverySystems,
              installation_of_variable_speed_drives: d.installationOfVariableSpeedDrives,
              year_of_installation: d.yearOfInstallation,
            }),
          });
        } catch (err) {
          console.error("[edit/cooling-systems] network error:", err);
        }
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 3) {
      const systems = values.operationalDetails?.ventilationSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          await fetch("/api/buildings/add/ventilation-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: editBuildingId,
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
          console.error("[edit/ventilation-systems] network error:", err);
        }
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 4) {
      const systems = values.operationalDetails?.lightingSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          await fetch("/api/buildings/add/lighting-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: editBuildingId,
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
          console.error("[edit/lighting-systems] network error:", err);
        }
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 5) {
      const systems = values.operationalDetails?.liftEscalatorSystem ?? [];
      const first = systems[0];
      if (!first || first.id) return true;
      try {
        await fetch("/api/buildings/add/lift-escalator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_uuid: editBuildingId,
            number_of_lifts: first.numberOfLifts,
            installation_of_lift_regenerative_features: first.installationOfLiftRegenerativeFeatures,
            installation_of_vvvf_and_sleep_mode: first.installationOfVVVFAndSleepMode,
            annual_energy_consumption: first.annualEnergyConsumption ?? undefined,
          }),
        });
      } catch (err) {
        console.error("[edit/lift-escalator] network error:", err);
      }
      return true;
    }

    if (activeMainStep.id === 2 && activeSubStep.id === 6) {
      const systems = values.operationalDetails?.hotWaterSystem ?? [];
      for (const system of systems) {
        if (system.id) continue;
        try {
          await fetch("/api/buildings/add/hot-water-systems", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              building_uuid: editBuildingId,
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
          console.error("[edit/hot-water-systems] network error:", err);
        }
      }
      return true;
    }

    return true;
  };

  const next = () => {
    let path = basePath;
    if (activeSubStep && activeMainStep) {
      if (activeSubStep.id < activeMainStep.steps!.length) {
        path += activeMainStep.path + activeMainStep.steps?.[activeSubStep.id].path;
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
    callStepApi().finally(() => {
      startTransition(() => { router.push(path); });
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

  const buildingInformation = useWatch({ control, name: "buildingInformation" });
  const operationalDetails = useWatch({ control, name: "operationalDetails" });

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

  const onSubmit = async () => {
    router.push("/buildings");
  };

  const prefetchEvent = useEffectEvent(() => {
    STEPS.forEach((step) => {
      if (step.steps) {
        step.steps.forEach((subStep) => {
          router.prefetch(basePath + step.path + subStep.path);
        });
      }
      router.prefetch(basePath + step.path);
    });
  });

  useEffect(() => {
    prefetchEvent();
  }, []);

  return (
    <EditBuildingContext.Provider
      value={{
        stepBadge: activeSubStep
          ? { current: activeSubStep.id, total: activeMainStep?.steps?.length || 0 }
          : null,
        title: activeSubStep
          ? activeSubStep.title || activeSubStep.label
          : activeMainStep?.title || "",
        description: activeSubStep
          ? activeSubStep.description
          : activeMainStep?.description || "",
        tip: activeSubStep ? activeSubStep.tip || null : activeMainStep?.tip || null,
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
        buildingUuid: editBuildingId,
      }}
    >
      <FormProvider handleSubmit={handleSubmit} control={control} getValues={getValues} {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {children}
        </form>
      </FormProvider>
    </EditBuildingContext.Provider>
  );
};

export const useEditBuilding = () => {
  const context = useContext(EditBuildingContext);
  if (!context) {
    throw new Error("useEditBuilding must be used within EditBuildingProvider");
  }
  return context;
};
