import { GridEmissionFactor } from "@/models/grid-emission-factor";

export const DUMMY_EC_GRID_FACTORS: GridEmissionFactor[] = [
  {
    id: "1",
    country: "us",
    gridFactors: [
      {
        year: "2022",
        gridFactor: 0.5,
        unit: "kgCO2/kWh",
        status: "Active",
      },
    ],
    status: "Active",
  },
  {
    id: "2",
    country: "de",
    gridFactors: [
      {
        year: "2022",
        gridFactor: 0.5,
        unit: "kgCO2/kWh",
        status: "Active",
      },
    ],
    status: "Active",
  },
]
  