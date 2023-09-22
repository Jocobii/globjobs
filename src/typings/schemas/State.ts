import { z } from 'zod'

export const StatusSchema = z.object({
  _id: z.string(),
  name: z.string(),
  color: z.string().optional(),
})

export type Status = z.infer<typeof StatusSchema>;
