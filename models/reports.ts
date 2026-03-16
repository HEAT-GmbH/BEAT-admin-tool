import * as z from "zod";
import { benchmarkingSchema, buildingEmissionSchema, complianceSchema, portfolioSummarySchema, reportSchema } from "./report.schema";

type AmountWithUnit = {
  amount: number;
  unit: string;
}
type LabelAmountUnit = AmountWithUnit & {
  label: string;
}

export type ReportSchema = z.infer<typeof reportSchema>
export type BuildingEmissionSchema = z.infer<typeof buildingEmissionSchema>
export type ComplianceSchema = z.infer<typeof complianceSchema>
export type BenchmarkingSchema = z.infer<typeof benchmarkingSchema>
export type PortfolioSchema = z.infer<typeof portfolioSummarySchema>

export type ReportType =
  | "building_emission"
  | "portfolio_summary"
  | "compliance"
  | "benchmarking";

export type BuildingEmissionReport = {
  type: "building_emission";
  config: {
    building: string;
    year: string;
    dataCompleteness: number;
    totalEmissions: AmountWithUnit;
    embodiedCarbon: AmountWithUnit;
    operationalCarbon: AmountWithUnit;
    floorArea: AmountWithUnit;
    embodiedCarbonBreakdown: LabelAmountUnit[];
    operationalCarbonBreakdown: LabelAmountUnit[];
  }
};

export type PortfolioSummaryReport = {
  type: "portfolio_summary";
  config: {
    country: string;
    year: string;
    organization: string;
    dataCompleteness: number;
    totalEmissions: AmountWithUnit;
    buildingsAssessed: number;
    avgCarbonIntensity: AmountWithUnit;
    embodiedCarbon: AmountWithUnit;
    operationalCarbon: AmountWithUnit;
    buildingBreakdown: {
      building: string;
      area: number;
      embodiedCarbon: AmountWithUnit;
      operationalCarbon: AmountWithUnit;
      totalEmissions: AmountWithUnit;
    }[]
  }
};

export type ComplianceReport = {
  type: "compliance";
  config: {
    country: string;
    year: string;
    reportingStandard: string;
    dataCompleteness: number;
    buildingsCovered: number;
    methodologyAndDataSources: {label: string, value: string}[];
    emissionBreakdown: LabelAmountUnit[];
  }
};

export type BenchmarkingReport = {
  type: "benchmarking";
  config: {
    country: string;
    buildingType: string;
    year: string;
    dataCompleteness: number;
    peerGroupSize: number;
    peerGroupCarbonIntensity: AmountWithUnit;
    performanceComparision: (LabelAmountUnit & {color:string})[];
    peerRankings: {rank: number, building: string, type: string, carbonIntensity: AmountWithUnit, rating: string, isOwnBuilding?:boolean}[]
  }
};


export type Report = BuildingEmissionReport | PortfolioSummaryReport | ComplianceReport | BenchmarkingReport;
export type GeneratedReport = Report & {
  generatedAt: Date;
  auditNotes?: string;
}