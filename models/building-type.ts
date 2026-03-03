export interface BuildingType {
  id: string;
  type: string;
  hasSubTypes: boolean;
  subTypes: BuildingSubType[];
  status: string;
}

export interface BuildingSubType {
  id: string;
  type: string;
  isActive: boolean;
}
