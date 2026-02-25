import { zodNumber } from "@/constants/zod";
import * as z from "zod";

const hoursDaysWeeks = z.object({
  hours: zodNumber,
  days: zodNumber,
  weeks: zodNumber,
})

export const chillerSystemSchema = z.object({
  id: z.string().optional(),
  type: z.literal("chiller"),
  data: z.object({
    type: z.string().min(1),
    yearOfInstallation: z.string().min(1),
    refrigerantType: z.string().min(1),
    refrigerantQuantity: zodNumber,
    installationOfVariableSpeedDrives: z.boolean(),
    installationOfHeatRecoverySystems: z.boolean(),
    totalCoolingLoad: zodNumber,
    baselineLeakageFactor: zodNumber.optional(),
    systemOperatingScehdule: hoursDaysWeeks.optional(),
    baselineCoolingEfficiency: zodNumber,
  }),
  otherDetails: z.object({
    numberOfChillers: zodNumber.optional(),
    totalChillerSystemPowerInput: zodNumber.optional(),
    waterCooledChillerCoolingLoadFactor: zodNumber.optional(),
    cop: zodNumber.optional(),
    iplv: zodNumber.optional(),
    energyEfficiencyLabel: z.string().min(1).optional(),
    numberOfStars: z.string().min(1).optional(),
    totalEnergyConsumptionAnnually: zodNumber.optional(),
  }).optional(),
});

export type ChillerSystem = z.infer<typeof chillerSystemSchema>;

export const airConditionSystemSchema = z.object({
  id: z.string().optional(),
  type: z.literal("air-condition"),
  data: z.object({
    type: z.string().min(1),
    yearOfInstallation: z.string().min(1),
    refrigerantType: z.string().min(1),
    refrigerantQuantity: zodNumber,
    totalCoolingLoad: zodNumber,
    baselineLeakageFactor: zodNumber.optional(),
    systemOperatingScehdule: hoursDaysWeeks.optional(),
  }),
  otherDetails: z.object({
    totalSplitVRVUnits: zodNumber.optional(),
    totalSplitVRVSystem: zodNumber.optional(),
    totalEnergyConsumptionAnnually: zodNumber.optional(),
    baselineSplitVRVEfficiency: zodNumber.optional(),
    iseerRating: zodNumber.optional(),
    cop: zodNumber.optional(),
    energyEfficiencyLabel: z.string().min(1).optional(),
    numberOfStars: z.string().min(1).optional(),
  }).optional(),
});

export type AirConditionSystem = z.infer<typeof airConditionSystemSchema>;

export const ventilationSystemSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1),
  capacityUnit: z.string().min(1),
  baselineEfficiency: zodNumber,
  systemOperatingSchedule: hoursDaysWeeks.optional(),
  totalPowerInput: zodNumber,
  airFlowRate: zodNumber,
  installationOfDemandControlledVentilation: z.boolean(),
  installationOfVariableSpeedDrives: z.coerce.boolean(),
  totalNumberOfVentilationTypeInstalled: zodNumber,
  totalEnergyConsumptionAnnually: zodNumber,
  energyEfficiencyLabel: z.string().min(1),
  numberOfStars: z.string().min(1),
});

export type VentilationSystem = z.infer<typeof ventilationSystemSchema>;

export const lightingSystemSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1),
  roomArea: zodNumber,
  lightBulbType: z.string().min(1),
  numberOfLightingBulbs: zodNumber,
  lightingBulbPowerRating: zodNumber,
  systemOperatingSchedule: hoursDaysWeeks,
  installationOfSensors: z.boolean(),
  baselineLightingPowerDensity: zodNumber,
  totalEnergyConsumptionAnnually: zodNumber,
  energyEfficiencyLabel: z.string().min(1),
  numberOfStars: z.string().min(1),
});

export type LightingSystem = z.infer<typeof lightingSystemSchema>;

export const liftEscalatorSystemSchema = z.object({
  id: z.string().optional(),
  numberOfLifts: zodNumber,
  installationOfLiftRegenerativeFeatures: z.boolean(),
  installationOfVVVFAndSleepMode: z.boolean(),
  annualEnergyConsumption: zodNumber.optional(),
});

export type LiftEscalatorSystem = z.infer<typeof liftEscalatorSystemSchema>;

export const hotWaterSystemSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1),
  fuelType: z.string().min(1),
  systemOperatingSchedule: hoursDaysWeeks,
  fuelConsumption: zodNumber,
  powerInput: zodNumber,
  baselineEfficiency: zodNumber,
  baselineEquipmentEfficiencyLevel: zodNumber,
  installationOfHeatRecoverySystem: z.boolean(),
  numberOfEquipment: zodNumber,
  energyEfficiencyLabel: z.string().min(1),
  numberOfStars: z.string().min(1),
});

export type HotWaterSystem = z.infer<typeof hotWaterSystemSchema>;

export const operationalDataEntrySchema = z.object({
  type: z.literal("wood").or(z.literal("fuel")).or(z.literal("oil")).or(z.literal("gas")),
  category: z.string().min(1),
  subCategory: z.string().min(1),
  childCategory: z.string().min(1),
  unit: z.string().min(1),
  emmissionFactor: zodNumber,
  epdType: z.literal("generic").or(z.literal("custom")).or(z.literal("official")),
  country: z.string().min(1),
  description: z.string().optional(),
  quantity: zodNumber.optional(),
  id: z.string().optional(),
})

export type OperationalDataEntry = z.infer<typeof operationalDataEntrySchema>;

export const materialSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string().min(1),
  quantity: zodNumber,
  unit: z.string().min(1),
  country: z.string().optional(),
  link: z.string().optional(),
  thickness: zodNumber.optional(), // for some materials
  pieces: zodNumber.optional(), // for some materials
});

export type Material = z.infer<typeof materialSchema>;

export const boqSchema = z.object({
  id: z.string().optional(),
  type: z.literal("boq"),
  name: z.string().min(1, "Name is required"),
  comment: z.string().optional(),
  materials: z.array(materialSchema),
});

export type BoQData = z.infer<typeof boqSchema>;

export const structuralComponentSchema = z.object({
  id: z.string().optional(),
  type: z.literal("component"),
  title: z.string().min(1, "Title is required"),
  country: z.string().optional(),
  buildingComponent: z.string().min(1, "Building component is required"),
  constructionTechnique: z.string().optional(),
  mode: z.enum(["custom", "selection"]).default("custom"),
  quantity: zodNumber,
  unit: z.string().min(1),
  comment: z.string().optional(),
  isPublic: z.boolean().default(false),
  materials: z.array(materialSchema),
});

export type StructuralComponentData = z.infer<typeof structuralComponentSchema>;

export const buildingStructuralComponentSchema = z.discriminatedUnion("type", [
  boqSchema,
  structuralComponentSchema,
]);

export type BuildingStructuralComponent = z.infer<typeof buildingStructuralComponentSchema>;


export const schema = z.object({
  buildingInformation: z.object({
    buildingNameLocation: z.object({
      nameOrCode: z.string().min(1),
      address: z.string().min(1),
      region: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
      longitude: z.string().optional(),
      latitude: z.string().optional(),
    }),
    buildingDetails: z.object({
      type: z.string().min(1),
      areaClimateType: z.string().min(1),
      assessmentPeriod: zodNumber,
      constructionYear: z.string().optional(),
      totalFloorArea: zodNumber,
      conditionedFloorArea: zodNumber.optional(),
      roomCoolingTemperature: zodNumber.optional(),
      numberOfFloorsBelowGround: zodNumber.optional(),
      energyConsumption: zodNumber,
      energyMonitoringControlSystems: z.string().min(1),
    }),
  }),
  operationalDetails: z.object({
    operationalScheduleTemperature: z.object({
      numberOfResidents: zodNumber,
      annualOperatingSchedule: hoursDaysWeeks,
      roomHeatingTemperature: zodNumber,
      roomCoolingTemperature: zodNumber,
    }),
    coolingSystem: z.array(
      z.discriminatedUnion("type", [
        chillerSystemSchema,
        airConditionSystemSchema,
      ]),
    ).min(1, "At least one cooling system is required"),
    ventilationSystem: z.array(ventilationSystemSchema).min(1, "At least one ventilation system is required"),
    lightingSystem: z.array(lightingSystemSchema).min(1, "At least one lighting system is required"),
    liftEscalatorSystem: z.array(liftEscalatorSystemSchema).min(1),
    hotWaterSystem: z.array(hotWaterSystemSchema).min(1)
  }),
  operationalDataEntry: z.array(operationalDataEntrySchema).min(1),
  buildingStructuralComponents: z.array(buildingStructuralComponentSchema)
});

export type AddBuildingForm = z.infer<typeof schema>;