import { z } from 'zod';

export const File = z.object({
  name: z.string(),
  url: z.string(),
  key: z.string(),
});

export const ValueDarwin = z.object({
  id: z.string().or(z.number()).nullish(),
  number: z.number().nullish(),
  type: z.number().nullish(),
  key: z.string().nullish(),
  FechaDePagoBanco: z.string().nullish(),
  aduana: z.string().nullish(),
  patente: z.string().nullish(),
  cliente: z.string().nullish(),
});

export const DataNode = z.object({
  file: File,
  ext: z.string(),
  validate: z.boolean().optional(),
  valueDarwin: ValueDarwin.optional(),
  name: z.string().optional(),
  tags: z.string().optional(),
  issues: z.array(z.object({})).nullish(),
  digitized: z.boolean().optional(),
  firstDigitized: z.boolean().optional(),
  unauthorized: z.boolean().optional(),
  integrationNumber: z.string().optional(),
  extraData: z.record(z.string(), z.unknown()).nullish(),
  delete: z.boolean().optional(),
  pendingAuthorization: z.boolean().optional(),
  pedimentoNumber: z.string().optional(),
  authorizedCashAmount: z.number().optional(),
});

export const nodeSchema = z.object({
  id: z.string().or(z.number()),
  parent: z.string().or(z.number()),
  text: z.string(),
  droppable: z.boolean().optional(),
  data: DataNode.optional(),
});

export type NodeModel = z.infer<typeof nodeSchema>;
