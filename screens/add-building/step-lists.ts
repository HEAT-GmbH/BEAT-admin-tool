import { AddBuildingStepConfig } from "@/models/building";

export const STEPS: AddBuildingStepConfig[] = [
  {
    id: 1,
    label: "Building Information",
    path: "/building-information",
    steps: [
      {
        id: 1,
        label: "Building Name & Location",
        path: "/building-name-location",
        description:
          "Add details concerning building name and locations of building.",
      },
      {
        id: 2,
        label: "Building Details",
        path: "/building-details",
        description: "Add detailed information about your building.",
      },
    ],
  },
  {
    id: 2,
    label: "Operational Details",
    path: "/operational-details",
    steps: [
      {
        id: 1,
        label: "Operational schedule & temperature",
        path: "/operational-schedule-temperature",
        description:
          "Complete field below to add operations information about your building",
      },
      {
        id: 2,
        label: "Cooling System",
        path: "/cooling-system",
        description:
          "Enter details of the building's cooling system, including type and capacity.",
      },
      {
        id: 3,
        label: "Ventilation System",
        path: "/ventilation-system",
        description:
          "Provide details on the building's ventilation type, capacity, and coverage to assess airflow and indoor air quality.",
      },
      {
        id: 4,
        label: "Lighting System",
        path: "/lighting-system",
        description:
          "Provide details on lighting types, power use, and controls to assess efficiency.",
      },
      {
        id: 5,
        label: "Lift & Escalator System",
        path: "/lift-escalator-system",
        description:
          "Provide details on lift & escalator systems in your building if any.",
      },
      {
        id: 6,
        label: "Hot Water System",
        path: "/hot-water-system",
        description:
          "Defines the building's method of producing and distributing hot water, including equipment type, energy source, and usage patterns",
      },
    ],
  },
  {
    id: 3,
    label: "Operational Data Entry",
    path: "/operational-data-entry",
    title: "Operational Energy carrier",
    description: "Tell us what fuels or energy sources your building runs on.",
    tip: "You need to add at least one energy carrier to continue",
  },
  {
    id: 4,
    label: "Building Structural Components",
    path: "/building-structural-components",
    title: "Building Structural Components",
    description:
      "Enter information about the building's walls, floors, roofs, and other structural parts.",
    tip: "If data is available as total quantity per material, select “Add from BoQ”. For quantities per components (foundation, floor, roof, etc.), use “Add component”. Refer to BEAT handbook for details.",
  },
];