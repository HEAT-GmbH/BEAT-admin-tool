export interface ClimateType {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  usage_count: number;
}