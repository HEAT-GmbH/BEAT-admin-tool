import { Organization } from "@/models/organization";

export const DUMMY_ORGANIZATIONS: Organization[] = [
  {
    id: "big-corp-int",
    name: "Big Corp Int.",
    joinDate: "24 Feb 2025",
    industry: "Construction",
    location: "India-Mumbai",
    status: "Active",
    buildingsCount: 0,
    admin: { name: "N/A" },
    totalEmissions: "N/A",
  },
  {
    id: "acme-corp",
    name: "Acme Corp",
    joinDate: "12 Jan 2024",
    industry: "Manufacturing",
    location: "Germany-Berlin",
    status: "Active",
    buildingsCount: 12,
    admin: { name: "Liam Miller" },
    totalEmissions: "1,100 tCO2e",
  },
  {
    id: "global-industries",
    name: "Global Industries",
    joinDate: "12 Jan 2024",
    industry: "Technology",
    location: "India - Mumbai",
    status: "In Active",
    buildingsCount: 5,
    admin: { name: "Ava Thompson" },
    totalEmissions: "1,240 tCO2e",
  },
];