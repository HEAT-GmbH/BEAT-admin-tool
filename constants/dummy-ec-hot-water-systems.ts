import { HotWaterSystemFactor } from "@/models/hot-water-system";

export const DUMMY_EC_HOT_WATER_SYSTEMS: HotWaterSystemFactor[] = [
  {
    id: "1",
    type: "Boiler",
    fuelTypes: [
      {
        name: "Natural Gas",
        isActive: true,
      }
    ],
    status: "Active",
  },
]