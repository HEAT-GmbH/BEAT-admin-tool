export interface CoolingSystemFactor {
  id: string;
  name: string;
  subTypes: {
    name: string;
    isActive: boolean;
  }[];
  refrigerants: {
    name: string;
    isActive: boolean;
  }[];
  status: "Active" | "Inactive";
}