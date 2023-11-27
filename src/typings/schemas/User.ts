import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  emailAddress: z.string(),
  employeeNumber: z.string(),
  birthDate: z.string(),
  phoneNumber: z.string(),
  headquarter: z.string(),
  department: z.string(),
  area: z.string(),
  coach: z.string(),
  charge: z.string(),
  employeeType: z.string(),
  costCenter: z.string(),
  darwinUser: z.string(),
  rbSystemsUser: z.string(),
  roles: z.array(z.string()),
  teamId: z.string(),
  teams: z.array(z.string()),
  active: z.boolean(),
  role: z.object({
    name: z.string(),
  }),
});

export type Users = z.infer<typeof userSchema>;
