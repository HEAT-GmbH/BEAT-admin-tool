import * as z from "zod";

export const orgDetailsSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  industry: z.string().min(1, "Industry is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
});

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

export const addOrgSchema = z.object({
  details: orgDetailsSchema,
  invites: z.array(inviteUserSchema).optional().default([]),
});

export type OrgDetailsData = z.infer<typeof orgDetailsSchema>;
export type InviteUserData = z.infer<typeof inviteUserSchema>;
export type AddOrgData = z.infer<typeof addOrgSchema>;
