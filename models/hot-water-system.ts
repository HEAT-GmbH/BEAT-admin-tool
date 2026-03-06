export interface HotWaterSystemFactor {
  id: string;
  type: string;
  fuelTypes: {
    name: string;
    isActive: boolean;
  }[];
  status: "Active" | "Inactive";
}