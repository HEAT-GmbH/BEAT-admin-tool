import { BenchmarkingReport, BuildingEmissionReport, ComplianceReport, PortfolioSummaryReport } from "@/models/reports";

export const DUMMY_BUILDING_EMISSION_REPORT: BuildingEmissionReport = {
  type: "building_emission",
  config: {
    building: "",
    year: "",
    dataCompleteness: 94,
    totalEmissions: {
      amount: 2820,
      unit: "tCO2e",
    },
    embodiedCarbon: {
      amount: 1580,
      unit: "tCO2e",
    },
    operationalCarbon: {
      amount: 1240,
      unit: "tCO2e",
    },
    floorArea: {
      amount: 18200,
      unit: "m2",
    },
    embodiedCarbonBreakdown: [
      { label: "Foundation & Substructure", amount: 312, unit: "tCO2e" },
      { label: "External Walls & Facade", amount: 278, unit: "tCO2e" },
      { label: "Structural Frame", amount: 245, unit: "tCO2e" },
      { label: "Windows & Glazing", amount: 134, unit: "tCO2e" },
      { label: "Roof Assembly", amount: 89, unit: "tCO2e" },
      { label: "Internal Partitions", amount: 56, unit: "tCO2e" },
    ],
    operationalCarbonBreakdown: [
      { label: "Cooling & HVAC", amount: 245, unit: "MWh" },
      { label: "Lighting", amount: 138, unit: "MWh" },
      { label: "Equipment & Plug Loads", amount: 109, unit: "MWh" },
      { label: "Water Heating", amount: 55, unit: "MWh" },
    ],
  },
}

export const DUMMY_PORTFOLIO_SUMMARY_REPORT: PortfolioSummaryReport = {
  type: "portfolio_summary",
  config: {
    country: "",
    year: "",
    organization: "",
    dataCompleteness: 94,
    totalEmissions: {
      amount: 30860,
      unit: "tCO2e",
    },
    embodiedCarbon: {
      amount: 1580,
      unit: "tCO2e",
    },
    operationalCarbon: {
      amount: 1240,
      unit: "tCO2e",
    },
    buildingsAssessed: 5,
    avgCarbonIntensity: {
      amount: 286,
      unit: "tCO2e/m2",
    },
    buildingBreakdown: [
      {
        building: "Al Bateen Tower",
        area: 24500,
        embodiedCarbon: { amount: 3680, unit: "tCO2e" },
        operationalCarbon: { amount: 3270, unit: "tCO2e" },
        totalEmissions: { amount: 6950, unit: "tCO2e" },
      },
      {
        building: "Marina Heights",
        area: 18200,
        embodiedCarbon: { amount: 2540, unit: "tCO2e" },
        operationalCarbon: { amount: 2810, unit: "tCO2e" },
        totalEmissions: { amount: 5350, unit: "tCO2e" },
      },
      {
        building: "Downtown Plaza",
        area: 31800,
        embodiedCarbon: { amount: 4120, unit: "tCO2e" },
        operationalCarbon: { amount: 4560, unit: "tCO2e" },
        totalEmissions: { amount: 8680, unit: "tCO2e" },
      },
      {
        building: "Creek Residences",
        area: 12400,
        embodiedCarbon: { amount: 1860, unit: "tCO2e" },
        operationalCarbon: { amount: 1940, unit: "tCO2e" },
        totalEmissions: { amount: 3800, unit: "tCO2e" },
      },
      {
        building: "Palm Business Centre",
        area: 22100,
        embodiedCarbon: { amount: 3100, unit: "tCO2e" },
        operationalCarbon: { amount: 2980, unit: "tCO2e" },
        totalEmissions: { amount: 6080, unit: "tCO2e" },
      },
    ]
  },
}

export const DUMMY_COMPLIANCE_REPORT: ComplianceReport = {
  type: "compliance",
  config: {
    country: "",
    year: "",
    reportingStandard: "",
    dataCompleteness: 100,
    buildingsCovered: 5,
    methodologyAndDataSources: [
      { label: "Reporting Framework", value: "GHG Protocol" },
      { label: "Assessment Boundary", value: "Cradle-to-grave (A1–C4) + Module D" },
      { label: "Reference Period", value: "2026" },
      { label: "Data Sources", value: "EPDs, ICE Database v3.0, National Grid Factors" },
      { label: "GWP Factors", value: "IPCC AR6 (100-year)" },
    ],
    emissionBreakdown: [
      { label: "Downtown Plaza", amount: 8680, unit: "tCO2e" },
      { label: "Al Bateen Tower", amount: 6950, unit: "tCO2e" },
      { label: "Palm Business Centre", amount: 6080, unit: "tCO2e" },
      { label: "Marina Heights", amount: 5350, unit: "tCO2e" },
      { label: "Creek Residences", amount: 3800, unit: "tCO2e" },
    ],
  },
}

export const DUMMY_BENCHMARKING_REPORT: BenchmarkingReport = {
  type: "benchmarking",
  config: {
    country: "",
    buildingType: "Commercial Office",
    year: "2026",
    dataCompleteness: 100,
    peerGroupSize: 45,
    peerGroupCarbonIntensity: {
      amount: 342,
      unit: "kgCO2e/m²",
    },
    performanceComparision: [
      { label: "Your Building", amount: 286, unit: "kgCO2e/m²", color: "#4ade80" },
      { label: "United Average", amount: 342, unit: "kgCO2e/m²", color: "#f97316" },
      { label: "Best in Class", amount: 180, unit: "kgCO2e/m²", color: "#bfdbfe" },
      { label: "ASHRAE Baseline", amount: 410, unit: "kgCO2e/m²", color: "#6b7280" },
    ],
    peerRankings: [
      { rank: 1, building: "Emirates Green Tower", type: "Commercial Office", carbonIntensity: { amount: 162, unit: "kgCO2e/m²" }, rating: "A+" },
      { rank: 2, building: "Sustainable Hub", type: "Commercial Office", carbonIntensity: { amount: 180, unit: "kgCO2e/m²" }, rating: "A" },
      { rank: 3, building: "Al Bateen Tower", type: "Commercial Office", carbonIntensity: { amount: 286, unit: "kgCO2e/m²" }, rating: "B+", isOwnBuilding: true },
      { rank: 4, building: "City Business Park", type: "Commercial Office", carbonIntensity: { amount: 318, unit: "kgCO2e/m²" }, rating: "B" },
      { rank: 5, building: "Creek Towers", type: "Mixed Use", carbonIntensity: { amount: 354, unit: "kgCO2e/m²" }, rating: "C+" },
      { rank: 6, building: "Industrial Complex", type: "Commercial Office", carbonIntensity: { amount: 402, unit: "kgCO2e/m²" }, rating: "C" },
      { rank: 7, building: "Heritage Mall", type: "Retail Mall", carbonIntensity: { amount: 455, unit: "kgCO2e/m²" }, rating: "D" },
    ]
  }
}
  
  