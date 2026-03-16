"use client";

import { Divider } from "@/components/divider";
import FormSelect from "@/components/form-select";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  benchmarkingSchema,
  buildingEmissionSchema,
  complianceSchema,
  portfolioSummarySchema,
  reportSchema as schema,
} from "@/models/report.schema";
import { ReportSchema, ReportType } from "@/models/reports";
import { Loader2, RefreshCw } from "lucide-react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { useReportContext } from "./context";
import { useEffect, useEffectEvent } from "react";

const REPORT_TYPES: {
  value: ReportType;
  item: string;
  description: string;
}[] = [
  {
    value: "building_emission",
    item: "Building Emission Report",
    description:
      "Detailed embodied and operational carbon breakdown for a single building.",
  },
  {
    value: "portfolio_summary",
    item: "Portfolio Summary",
    description:
      "Aggregated emissions overview across all buildings in a portfolio.",
  },
  {
    value: "compliance",
    item: "Compliance Report",
    description:
      "Regulatory compliance assessment against selected reporting standards.",
  },
  {
    value: "benchmarking",
    item: "Benchmarking Report",
    description:
      "Compare building performance against industry peers and baselines.",
  },
];

const BUILDINGS = [
  "Al Bateen Tower",
  "Marina Heights",
  "Downtown Plaza",
  "Creek Residences",
  "Palm Business Centre",
].map((b) => ({ value: b, item: b }));
const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Bahrain",
  "Kuwait",
  "Oman",
].map((b) => ({ value: b, item: b }));
const YEARS = ["2026", "2025", "2024", "2023", "2022"].map((b) => ({
  value: b,
  item: b,
}));
const ORGANIZATIONS = [
  "ADNOC Properties",
  "Aldar Properties",
  "Emaar Group",
  "Majid Al Futtaim",
  "Mubadala RE",
].map((b) => ({ value: b, item: b }));
const REPORTING_STANDARDS = [
  "GHG Protocol",
  "ISO 14064",
  "RICS WLC",
  "EN 15978",
  "LEED v4.1",
].map((b) => ({ value: b, item: b }));
const BUILDING_TYPES = [
  "Commercial Office",
  "Residential Tower",
  "Mixed Use",
  "Retail Mall",
  "Industrial Warehouse",
].map((b) => ({ value: b, item: b }));

export const LeftPanel = () => {
  const { generatedReport, isGenerating, resetReport, paramsUsed } =
    useReportContext();
  const { control } = useFormContext<ReportSchema>();
  const { isValid } = useFormState();

  const type = useWatch({ control, name: "type" });
  const config = useWatch({ control, name: "config" });

  const selectedTypeData =
    REPORT_TYPES.find((t) => t.value === type) || REPORT_TYPES[0];

  const reset = useEffectEvent(() => {
    if (type !== paramsUsed.type) {
      resetReport();
      return;
    }
    const unChanged = Object.keys(paramsUsed.config).every(
      (key) =>
        paramsUsed.config[key as keyof ReportSchema["config"]] ===
        config[key as keyof ReportSchema["config"]],
    );
    if (!unChanged) {
      resetReport();
    }
  });
  useEffect(() => {
    reset();
  }, [type, config, paramsUsed]);

  return (
    <div className="flex flex-col flex-1 sm:w-85 border-r border-border overflow-y-auto hide-scrollbar bg-card p-5 gap-5">
      <div className="space-y-1">
        <FormSelect
          id="type"
          control={control as any}
          schema={schema}
          name="type"
          label="Report Type"
          items={REPORT_TYPES}
          placeholder="Choose a report type"
        />
        <p className="text-secondary-foreground">
          {selectedTypeData.description}
        </p>
      </div>
      <Divider />
      <span className="text-sm font-medium text-muted-foreground">
        CONFIGURATION
      </span>
      {type === "building_emission" && (
        <>
          <FormSelect
            id={type + "_building"}
            key={type + "_building"}
            control={control as any}
            schema={buildingEmissionSchema}
            name="config.building"
            label="Building"
            items={BUILDINGS}
            placeholder="Choose a building"
          />
          <FormSelect
            id={type + "_year"}
            key={type + "_year"}
            control={control as any}
            schema={buildingEmissionSchema}
            name="config.year"
            label="Year"
            items={YEARS}
          />
        </>
      )}
      {type === "portfolio_summary" && (
        <>
          <FormSelect
            id={type + "_country"}
            key={type + "_country"}
            control={control as any}
            schema={portfolioSummarySchema}
            name="config.country"
            label="Country"
            items={COUNTRIES}
          />
          <FormSelect
            id={type + "_year"}
            key={type + "_year"}
            control={control as any}
            schema={portfolioSummarySchema}
            name="config.year"
            label="Year"
            items={YEARS}
          />
          <FormSelect
            id={type + "_organization"}
            key={type + "_organization"}
            control={control as any}
            schema={portfolioSummarySchema}
            name="config.organization"
            label="Organization"
            items={ORGANIZATIONS}
          />
        </>
      )}
      {type === "compliance" && (
        <>
          <FormSelect
            id={type + "_country"}
            key={type + "_country"}
            control={control as any}
            schema={complianceSchema}
            name="config.country"
            label="Country"
            items={COUNTRIES}
          />
          <FormSelect
            id={type + "_year"}
            key={type + "_year"}
            control={control as any}
            schema={complianceSchema}
            name="config.year"
            label="Year"
            items={YEARS}
          />
          <FormSelect
            id={type + "_reportingStandard"}
            key={type + "_reportingStandard"}
            control={control as any}
            schema={complianceSchema}
            name="config.reportingStandard"
            label="Reporting Standard"
            items={REPORTING_STANDARDS}
          />
        </>
      )}
      {type === "benchmarking" && (
        <>
          <FormSelect
            id={type + "_country"}
            key={type + "_country"}
            control={control as any}
            schema={benchmarkingSchema}
            name="config.country"
            label="Country"
            items={COUNTRIES}
          />
          <FormSelect
            id={type + "_buildingType"}
            key={type + "_buildingType"}
            control={control as any}
            schema={benchmarkingSchema}
            name="config.buildingType"
            label="Building Type"
            items={BUILDING_TYPES}
          />
          <FormSelect
            id={type + "_year"}
            key={type + "_year"}
            control={control as any}
            schema={benchmarkingSchema}
            name="config.year"
            label="Year"
            items={YEARS}
          />
        </>
      )}
      <Divider />
      <Button
        type="submit"
        disabled={isGenerating || !isValid}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={14} />
            Generating...
          </>
        ) : !!generatedReport ? (
          <>
            <RefreshCw size={14} />
            Regenerate Report
          </>
        ) : (
          <>
            <Icon name="file-chart-fill" size={20} />
            Generate Report
          </>
        )}
      </Button>
      {!!generatedReport && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Icon size={14} name="download-2-line" />
            Export PDF
          </Button>
          <Button variant="outline" className="flex-1">
            <Icon size={14} name="download-2-line" />
            Export Excel
          </Button>
        </div>
      )}
    </div>
  );
};
