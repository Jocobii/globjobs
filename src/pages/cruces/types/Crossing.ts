import { z } from 'zod'
import { userSchema, StatusSchema } from '@/typings'
import { MyNodeModel } from '@/typings/schemas/Node'

export const nodes = z.object({
  tree: z.array(MyNodeModel),
  externalNode: z.array(MyNodeModel),
  dispatchFileNode: z.array(MyNodeModel)
})

export const RequiredActions = z.array(z.object({
  fileNodeId: z.string(),
  name: z.string(),
  nameFile: z.string(),
  resolved: z.boolean()
}))

export const History = z.array(z.object({
  user:  z.object({
    id: z.string(),
    name: z.string(),
    lastName: z.string().optional()
  }),
  action: z.string(),
  operationDate: z.date(),
  files: z.array(z.string())
}));

const MinimalUser = userSchema.pick({
  id: true,
  name: true,
  lastName: true,
});

export const Crossing = z.object({
  id: z.string(),
  number: z.string(),
  client: z.string({
    required_error: "El cliente es requerido",
    invalid_type_error: "El cliente es requerido"
  }),
  clientNumber: z.string({
    required_error: "El cliente es requerido",
    invalid_type_error: "El cliente no puede estar vacio"
  }),
  patente: z.string().length(4, { message: 'La patente debe contener 4 numeros'}),
  aduana: z.string().length(3, { message: 'La aduana debe contener 3 numeros'}),
  user: MinimalUser,
  trafficUser: MinimalUser,
  customerUser: MinimalUser,
  type: z.string({
    required_error: "El tipo de es requerido",
    invalid_type_error: "El tipo debe ser texto"
  }),
  status: StatusSchema,
  typeModulation: z.string().optional(),
  nodes: nodes,
  sentDarwin: z.boolean(),
  history: History,
  createBy: z.object({
    name: z.string(),
    lastName: z.string()
  }),
  comments: z.string().optional(),
  isWithoutTxtFlow: z.boolean(),
  requiredActions: RequiredActions
});

export type Crossing = z.infer<typeof Crossing>;

export const CreateCrossing = Crossing.pick({
  type: true,
  client: true,
  clientNumber: true,
  patente: true,
  aduana: true,
  comments: true,
});

export type CreateCrossingType = z.infer<typeof CreateCrossing>;