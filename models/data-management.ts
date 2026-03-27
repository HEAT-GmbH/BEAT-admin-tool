import { ExportFormat } from "./common";

type ImportStatus = "Success" | "Partial" | "Failed" | "Processing";
type DataType =
  | "Energy"
  | "Fuel"
  | "Refrigerant"
  | "Emission Factors"
  | "EPD Data";

export interface DataManagementImportRow {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  dataType: DataType;
  buildings: number;
  records: number;
  uploadedBy: string;
  date: string;
  status: ImportStatus;
}

export interface DataManagementExportRow {
  id: string;
  exportName: string;
  reportType: string;
  buildingsCount: number;
  dateRange: string;
  format: ExportFormat;
  generatedBy: string;
  date: string;
}

interface DataManagementSummaryItem {
  value: number;
  description: string;
  note: string;
}

export interface DataManagementSummary {
  totalImports: DataManagementSummaryItem;
  recordsProcessed: DataManagementSummaryItem;
  failedImports: DataManagementSummaryItem;
  exportGenerated: DataManagementSummaryItem;
}
