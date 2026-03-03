import * as z from "zod";

export const epdLibrarySearchSchema = z.object({
  searchValue: z.string().optional(),
  country: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  childCategory: z.string().optional(),
  epdType: z.string().optional(),
  sortBy: z.string().optional(),
});

export type EpdLibrarySearch = z.infer<typeof epdLibrarySearchSchema>;

export const epdLibraryFormSchema = z.object({
  search: epdLibrarySearchSchema,
  selections: z.record(z.string(), z.number()).default({}),
});

export type EpdLibraryForm = z.infer<typeof epdLibraryFormSchema>;
