import * as z from "zod";

export const addCountrySchema = z.object({
  country: z.string().min(1, "Country is required"),
  cities: z.array(z.string()).min(1, "At least one city is required"),
});

export type AddCountryData = z.infer<typeof addCountrySchema>;
