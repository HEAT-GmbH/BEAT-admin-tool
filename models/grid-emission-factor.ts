export interface GridEmissionFactor {
  id: string;
  country: string;
  gridFactors: {
    year: string;
    gridFactor: number;
    unit: string;
    status: "Active" | "Inactive";
  }[];
  status: "Active" | "Inactive";
}