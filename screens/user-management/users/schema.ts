import * as z from "zod";

const permission = z.object({
  view: z.boolean(),
  create: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
  export: z.boolean(), 
  all: z.boolean()
});

export const permissions = z.object({
  buildings: permission,
  emissionConfig: permission,
  users: permission,
  reports: permission,
  dashboard: permission,
  dataManagement: permission,
  organizations: permission,
  systemSettings: permission,
})

export const manageUserSchema = z.object({
  userDetails: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Email is invalid").min(1, "Email is required"),
    organization: z.string().optional(),
    countryAccess: z.string().min(1, "Country access is required"),
  }),
  roles: z.object({
    role: z.string().min(1, "Role is required"),
    permissions,
  })
});

export type ManageUser = z.infer<typeof manageUserSchema>;

