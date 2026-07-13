import { zodNumber } from "@/constants/zod";
import * as z from "zod";

const zodPositiveInt = (min: number, max: number, label: string) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().int().min(min, `${label} must be at least ${min}`).max(max, `${label} must be at most ${max}`)
  );

const hoursDaysWeeks = z.object({
  hours: zodPositiveInt(1, 24, "Hours per day"),
  days: zodPositiveInt(1, 7, "Days per week"),
  weeks: zodPositiveInt(1, 52, "Weeks per year"),
})

export const chillerSystemSchema = z.object({
  id: z.string().optional(),
  type: z.literal("chiller"),
  // chiller sub-type: water-cooled or air-cooled
  chillerType: z.enum(["water-cooled", "air-cooled"]),
  yearOfInstallation: z.string().min(1, "Year of installation is required"),
  refrigerantType: z.string().min(1, "Refrigerant type is required"),
  refrigerantQuantity: zodNumber,
  totalCoolingLoad: zodNumber,
  numberOfChillers: zodNumber,
  baselineLeakageFactor: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().min(0).max(100)
  ),
  operatingSchedule: hoursDaysWeeks,
  baselineCoolingEfficiency: zodNumber,
  installationOfVariableSpeedDrives: z.boolean(),
  installationOfHeatRecoverySystems: z.boolean(),
  // optional other details
  iplv: zodNumber.optional(),
  waterCooledChillerCoolingLoadFactor: zodNumber.optional(),
  totalChillerSystemPowerInput: zodNumber.optional(),
  cop: zodNumber.optional(),
  energyEfficiencyLabel: z.string().optional(),
  numberOfStars: z.string().optional(),
});

export type ChillerSystem = z.infer<typeof chillerSystemSchema>;

export const airConditionSystemSchema = z.object({
  id: z.string().optional(),
  type: z.literal("air-condition"),
  // ac sub-type: window / split / vrv / packaged
  acType: z.enum(["window", "split", "vrv", "packaged"]),
  // packaged only
  packagedSubtype: z.string().optional(),
  yearOfInstallation: z.string().min(1, "Year of installation is required"),
  refrigerantType: z.string().min(1, "Refrigerant type is required"),
  refrigerantQuantity: zodNumber,
  coolingCapacityPerUnit: zodNumber,
  coolingCapacityUnit: z.enum(["ton", "btu_hr", "kw"]),
  numberOfUnits: zodNumber,
  baselineLeakageFactor: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().min(0).max(100)
  ),
  operatingSchedule: hoursDaysWeeks,
  eerIseerCop: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().min(0.01, "Must be greater than 0")
  ),
  // optional other details
  powerInputPerUnit: zodNumber.optional(),
  energyEfficiencyLabel: z.string().optional(),
  numberOfStars: z.string().optional(),
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
      nameOrCode: z.string().min(2, "Building name must be at least 2 characters"),
      address: z.string().min(5, "Address is required (minimum 5 characters)"),
      region: z.string().min(1, "Please select a region or state"),
      city: z.string().min(1, "Please select a city"),
      country: z.string().min(1, "Please select a country"),
      longitude: z.string().optional().refine(
        (v) => !v || (!isNaN(Number(v)) && Number(v) >= -180 && Number(v) <= 180),
        { message: "Longitude must be between -180 and 180" },
      ),
      latitude: z.string().optional().refine(
        (v) => !v || (!isNaN(Number(v)) && Number(v) >= -90 && Number(v) <= 90),
        { message: "Latitude must be between -90 and 90" },
      ),
    }),
    buildingDetails: z.object({
      buildingTypeId: z.string().min(1, "Please select a building type"),
      apartmentTypeId: z.string().optional(),
      climateTypeId: z.string().min(1, "Please select a climate type"),
      assessmentPeriod: zodNumber,
      constructionYear: z.string().optional().refine(
        (v) => !v || (/^\d{4}$/.test(v) && Number(v) >= 1900 && Number(v) <= new Date().getFullYear()),
        { message: `Construction year must be between 1900 and ${new Date().getFullYear()}` },
      ),
      totalFloorArea: zodNumber,
      conditionedFloorArea: zodNumber.optional(),
      numberOfFloorsBelowGround: zodNumber.optional(),
      hasCertification: z.string().min(1, "Please select an option"),
      hasBOQ: z.string().min(1, "Please select an option"),
    }),
  }),
  operationalDetails: z.object({
    operationalScheduleTemperature: z.object({
      numberOfResidents: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.coerce.number().int().min(1, "Must be at least 1")
      ),
      annualOperatingSchedule: hoursDaysWeeks,
      roomHeatingTemperature: zodNumber,
      heatingTemperatureUnit: z.string().min(1),
      roomCoolingTemperature: zodNumber,
      coolingTemperatureUnit: z.string().min(1),
      renewableEnergyPercent: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.coerce.number().min(0.01, "Must be greater than 0").max(100, "Must be at most 100")
      ),
      buildingSmartSystem: z.string().min(1, "Please select an option"),
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