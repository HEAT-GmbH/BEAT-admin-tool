import { CoolingSystemFactor } from "@/models/cooling-system";

export const DUMMY_EC_COOLING_SYSTEMS: CoolingSystemFactor[] = [
  {
    id: "1",
    name: "Chiller",
    subTypes: [      
      {
        name: "Water cooled chiller",
        isActive: true,
      },
      {
        name: "Air cooled chiller",
        isActive: true,
      },
      {
        name: "Evaporative cooled chiller",
        isActive: true,
      },
    ],
    refrigerants: [
      {
        name: "R-134a",
        isActive: true,
      }
    ],
    status: "Active",
  },
]