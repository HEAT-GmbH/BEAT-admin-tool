import * as z from "zod";

const hoursDaysWeeks = z.object({
  hours: z.number(),
  days: z.number(),
  weeks: z.number(),
})

const chillerSystemSchema = z.object({
  data: z.object({
    type: z.string(),
    yearOfInstallation: z.string(),
    refrigerantType: z.string(),
    refrigerantQuantity: z.number(),
    installationOfVariableSpeedDrives: z.boolean(),
    installationOfHeatRecoverySystems: z.boolean(),
    totalCoolingLoad: z.number(),
    baselineLeakageFactor: z.number().optional(),
    systemOperatingScehdule: hoursDaysWeeks.optional(),
    baselineCoolingEfficiency: z.number(),
  }),
  otherDetails: z.object({
    numberOfChillers: z.number(),
    totalChillerSystemPowerInput: z.number(),
    waterCooledChillerCoolingLoadFactor: z.number(),
    cop: z.number(),
    iplv: z.number(),
    energyEfficiencyLabel: z.string(),
    numberOfStars: z.string(),
  }).optional(),
});

const airConditionSystemSchema = z.object({
  data: z.object({
    type: z.string(),
    yearOfInstallation: z.string(),
    refrigerantType: z.string(),
    refrigerantQuantity: z.number(),
    totalCoolingLoad: z.number(),
    baselineLeakageFactor: z.number().optional(),
    systemOperatingScehdule: hoursDaysWeeks.optional(),
  }),
  otherDetails: z.object({
    totalSplitVRVUnits: z.number(),
    totalSplitVRVSystem: z.number(),
    totalEnergyConsumptionAnnually: z.number(),
    baselineSplitVRVEfficiency: z.number(),
    cop: z.number(),
    energyEfficiencyLabel: z.string(),
    numberOfStars: z.string(),
  }).optional(),
});

export const schema = z.object({
  buildingInformation: z.object({
    buildingNameLocation: z.object({
      nameOrCode: z.string(),
      address: z.string(),
      region: z.string(),
      city: z.string(),
      country: z.string(),
      longitude: z.string().optional(),
      latitude: z.string().optional(),
    }),
    buildingDetails: z.object({
      type: z.string(),
      areaClimateType: z.string(),
      assessmentPeriod: z.number(),
      constructionYear: z.string().optional(),
      totalFloorArea: z.number(),
      conditionedFloorArea: z.number().optional(),
      roomCoolingTemperature: z.number().optional(),
      numberOfFloorsBelowGround: z.number().optional(),
      energyConsumption: z.number(),
      energyMonitoringControlSystems: z.string(),
    }),
  }),
  operationalDetails: z.object({
    operationalScheduleTemperature: z.object({
      numberOfResidents: z.number(),
      annualOperatingSchedule: hoursDaysWeeks,
      roomHeatingTemperature: z.number(),
      roomCoolingTemperature: z.number(),
    }),
    coolingSystem: z.array(
      z.discriminatedUnion("type", [
        z.object({
          id: z.string().optional(),
          type: z.literal("chiller"),
          ...chillerSystemSchema.shape,
        }),
        z.object({
          type: z.literal("air-condition"),
          ...airConditionSystemSchema.shape,
        }),
      ]),
    ).min(1, "At least one cooling system is required"),
    ventilationSystem: z.array(
      z.object({
        id: z.string().optional(),
        type: z.string(),
        capacityUnit: z.string(),
        baselineEfficiency: z.number(),
        systemOperatingSchedule: hoursDaysWeeks.optional(),
        totalPowerInput: z.number(),
        airFlowRate: z.number(),
        installationOfDemandControlledVentilation: z.boolean(),
        installationOfVariableSpeedDrives: z.boolean(),
        totalNumberOfVentilationTypeInstalled: z.number(),
        totalEnergyConsumptionAnnually: z.number(),
        energyEfficiencyLabel: z.string(),
        numberOfStars: z.string(),
      })
    ).min(1, "At least one ventilation system is required"),
    lightingSystem: z.array(
      z.object({
        id: z.string().optional(),
        type: z.string(),
        roomArea: z.number(),
        lightBulbType: z.string(),
        numberOfLightingBulbs: z.number(),
        lightingBulbPowerRating: z.number(),
        systemOperatingSchedule: hoursDaysWeeks,
        installationOfSensors: z.boolean(),
        baselineLightingPowerDensity: z.number(),
        totalEnergyConsumptionAnnually: z.number(),
        energyEfficiencyLabel: z.string(),
        numberOfStars: z.string(),
      })
    ).min(1, "At least one lighting system is required"),
    liftEscalatorSystem: z.array(
      z.object({
        id: z.string().optional(),
        numberOfLifts: z.number(),
        installationOfLiftRegenerativeFeatures: z.boolean(),
        installationOfVVVFAndSleepMode: z.boolean(),
        annualEnergyConsumption: z.number().optional()
      })
    ).min(1),
    hotWaterSystem: z.array(
      z.object({
        id: z.string().optional(),
        type: z.string(),
        fuelType: z.string(),
        systemOperatingSchedule: hoursDaysWeeks,
        fuelConsumption: z.number(),
        powerInput: z.number(),
        baselineEfficiency: z.number(),
        baselineEquipmentEfficiencyLevel: z.number(),
        installationOfHeatRecoverySystem: z.boolean(),
        numberOfEquipment: z.number(),
        energyEfficiencyLabel: z.string(),
        numberOfStars: z.string(),
      })
    ).min(1)
  }),
});

export type AddBuildingForm = z.infer<typeof schema>;