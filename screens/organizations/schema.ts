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

// Rows in the invite step can be left blank — only validate non-empty rows.
const inviteRowSchema = z.object({
  email: z.string().optional().default(""),
  role: z.string().optional().default(""),
}).superRefine((val, ctx) => {
  const hasEmail = !!val.email;
  const hasRole = !!val.role;
  // Only validate if the user started filling in the row
  if (hasEmail && !z.string().email().safeParse(val.email).success) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid email address", path: ["email"] });
  }
  if (hasEmail && !hasRole) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Role is required", path: ["role"] });
  }
  if (hasRole && !hasEmail) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email is required", path: ["email"] });
  }
});

export const addOrgSchema = z.object({
  details: orgDetailsSchema,
  invites: z.array(inviteRowSchema).optional().default([]),
});

export type OrgDetailsData = z.infer<typeof orgDetailsSchema>;
export type InviteUserData = z.infer<typeof inviteUserSchema>;
export type AddOrgData = z.infer<typeof addOrgSchema>;
