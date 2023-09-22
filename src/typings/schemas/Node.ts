import { z } from 'zod';

export const File = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  url: z.string(),
  key: z.string(),
});

export const ValueDarwin = z.object({
  id: z.string(),
  number: z.number(),
  type: z.number(),
  key: z.string(),
  clientNumber: z.string().optional(),
  integrationNumber: z.string().optional(),
});

export const DataNode = z.object({
  file: File,
  ext: z.string(),
  validate: z.boolean().optional(),
  valueDarwin: ValueDarwin,
  name: z.string().optional(),
  tags: z.string().optional(),
  issues: z.array(z.object({})),
  digitized: z.boolean().optional(),
  firstDigitized: z.boolean().optional(),
  unauthorized: z.boolean().optional(),
  integrationNumber: z.string().optional(),
  extraData: z.record(z.string(), z.unknown()),
  delete: z.boolean().optional(),
  pendingAuthorization: z.boolean().optional(),
  pedimentoNumber: z.string().optional(),
  authorizedCashAmount: z.number().optional(),
});

export const MyNodeModel = z.object({
  id: z.string().or(z.number()),
  parent: z.string().or(z.number()),
  text: z.string(),
  droppable: z.boolean().optional(),
  data: DataNode,
});

export type NodeModel = z.infer<typeof MyNodeModel>