export interface FuelEmissionFactor {
  id: string;
  type: string;
  emissionFactor: number;
  unit: string;
  status: "Active" | "Inactive";
}