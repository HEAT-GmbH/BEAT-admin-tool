export type ExportFormat = "PDF" | "XLSX" | "CSV";

export type BasePaginatedTable<T extends object = {}> = {
  search?: string;
  currentPage: number;
  pageSize: number;
} & T

export type BasePaginatedResponse<T> = {
  data: T[];
  currentPage: number;
  totalItems: number;
}