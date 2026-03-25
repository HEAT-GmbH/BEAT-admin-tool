import { BuildingType } from "@/models/building-type";

export const DUMMY_SYSTEM_BUILDINGS: BuildingType[] = [
  {
    id: "1",
    type: "Homes",
    hasSubTypes: true,
    subTypes: [
      {
        id: "1",
        type: "Grade A",
        isActive: true,
      },
      {
        id: "2",
        type: "Grade B",
        isActive: true,
      },
      {
        id: "3",
        type: "Grade C",
        isActive: true,
      },
      {
        id: "4",
        type: "Grade D",
        isActive: true,
      },
      {
        id: "5",
        type: "Grade E",
        isActive: true,
      },
      {
        id: "6",
        type: "Grade F",
        isActive: true,
      },
      {
        id: "7",
        type: "Grade G",
        isActive: true,
      },
    ],
    status: "Active",
  },
  {
    id: "2",
    type: "Apartments",
    hasSubTypes: true,
    subTypes: [
      {
        id: "1",
        type: "Grade A",
        isActive: true,
      },
      {
        id: "2",
        type: "Grade B",
        isActive: true,
      },
      {
        id: "3",
        type: "Grade C",
        isActive: true,
      },
      {
        id: "4",
        type: "Grade D",
        isActive: true,
      },
      {
        id: "5",
        type: "Grade E",
        isActive: true,
      },
      {
        id: "6",
        type: "Grade F",
        isActive: true,
      },
      {
        id: "7",
        type: "Grade G",
        isActive: true,
      },
    ],
    status: "Active",
  },
];