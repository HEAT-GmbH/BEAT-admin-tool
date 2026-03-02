import * as z from "zod";

export const operationalDataEntrySearchSchema = z.object({
  searchValue: z.string().optional(),
  country: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  childCategory: z.string().optional(),
  epdType: z.string().optional(),
})
export type OperationalDataEntrySearchSchema = z.infer<typeof operationalDataEntrySearchSchema>;