export interface EPD {
  id: string;
  name: string;
  country: string;
  category: string;
  subCategory: string;
  childCategory: string;
  epdType: "official" | "generic" | "custom";
  kgCO2e: number;
}
