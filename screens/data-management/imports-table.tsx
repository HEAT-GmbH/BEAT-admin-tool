"use client";

import { useForm } from "react-hook-form";
import { BaseTable } from "./base-table";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/form-select";
import { apiService } from "@/services/api.service";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Download,
  Droplet,
  Eye,
  FileText,
  LayoutGrid,
  RefreshCcw,
  Thermometer,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { DataManagementImportRow } from "@/models/data-management";

const schema = z.object({
  status: z.string().optional(),
  dataType: z.string().optional(),
});

export const ImportsTable = () => {
  const { control, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "",
      dataType: "",
    },
  });

  const status = watch("status");
  const dataType = watch("dataType");

  const columns: ColumnDef<DataManagementImportRow>[] = [
    {
      accessorKey: "fileName",
      header: "File / Source",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {row.original.fileName}
          </span>
          <span className="text-secondary-foreground text-xs uppercase">
            {row.original.fileType} - {row.original.fileSize}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "dataType",
      header: "Data Type",
      cell: ({ row }) => {
        const dataType = row.original.dataType;
        let Icon = LayoutGrid;
        if (dataType === "Energy") Icon = Zap;
        if (dataType === "Fuel") Icon = Droplet;
        if (dataType === "Refrigerant") Icon = Thermometer;
        if (dataType === "Emission Factors") Icon = FileText;
        if (dataType === "EPD Data") Icon = LayoutGrid;

        return (
          <Badge variant="outline" className="gap-1.5 font-normal py-1 px-3">
            <Icon className="size-3.5 text-muted-foreground" />
            {dataType}
          </Badge>
        );
      },
    },
    {
      accessorKey: "buildings",
      header: "Buildings",
      cell: ({ row }) => <span className="pl-4">{row.original.buildings}</span>,
    },
    {
      accessorKey: "records",
      header: "Records",
      cell: ({ row }) => row.original.records.toLocaleString(),
    },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let dotColor = "bg-muted-foreground";

        if (status === "Success") {
          dotColor = "bg-green-500";
        } else if (status === "Partial") {
          dotColor = "bg-orange-500";
        } else if (status === "Failed") {
          dotColor = "bg-red-500";
        } else if (status === "Processing") {
          dotColor = "bg-blue-500";
        }

        return (
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5 font-normal">
            <div className={cn("size-1.5 rounded-full", dotColor)} />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="flex items-center gap-4 text-xs font-medium">
            {status !== "Failed" && status !== "Processing" && (
              <button className="flex items-center gap-1.5 text-foreground/80 hover:text-foreground">
                <Eye className="size-3.5" />
                Report
              </button>
            )}
            {status === "Success" && (
              <button className="text-foreground/80 hover:text-foreground">
                <Download className="size-3.5" />
              </button>
            )}
            {(status === "Partial" || status === "Failed") && (
              <button className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600">
                <AlertCircle className="size-3.5" />
                Errors
              </button>
            )}
            {status === "Failed" && (
              <button className="flex items-center gap-1.5 text-foreground/80 hover:text-foreground">
                <RefreshCcw className="size-3.5" />
                Re-upload
              </button>
            )}
            {status === "Processing" && (
              <span className="text-muted-foreground">In progress...</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <BaseTable
      queryKey="data-management-imports"
      queryFn={(params) =>
        apiService.getDataManagementImports({ ...params, status, dataType })
      }
      columns={columns}
    >
      <FormSelect
        control={control}
        name="status"
        schema={schema}
        id="status"
        placeholder="Status"
        items={["All", "Success", "Partial", "Failed", "Processing"].map(
          (item) => ({ value: item, item }),
        )}
        defaultValue="All"
      />
      <FormSelect
        control={control}
        name="dataType"
        schema={schema}
        id="dataType"
        placeholder="Data Type"
        items={[
          "Energy",
          "Fuel",
          "Refrigerant",
          "Emission Factors",
          "EPD Data",
        ].map((item) => ({ value: item, item }))}
        defaultValue="All"
      />
    </BaseTable>
  );
};
