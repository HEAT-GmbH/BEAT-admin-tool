import z from "zod";

export const buildingEmissionSchema = z.object({
  type: z.literal("building_emission"),
  config: z.object({
    building: z.string().min(1),
    year: z.string().min(1),
  }),
});

export const portfolioSummarySchema = z.object({
  type: z.literal("portfolio_summary"),
  config: z.object({
    country: z.string().min(1),
    year: z.string().min(1),
    organization: z.string().min(1),
  }),
});

export const complianceSchema = z.object({
  type: z.literal("compliance"),
  config: z.object({
    country: z.string().min(1),
    year: z.string().min(1),
    reportingStandard: z.string().min(1),
  }),
});

export const benchmarkingSchema = z.object({
  type: z.literal("benchmarking"),
  config: z.object({
    country: z.string().min(1),
    buildingType: z.string().min(1),
    year: z.string().min(1),
  }),
});

export const reportSchema = z.discriminatedUnion("type", [
  buildingEmissionSchema,
  portfolioSummarySchema,
  complianceSchema,
  benchmarkingSchema,
]);