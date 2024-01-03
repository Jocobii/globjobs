import {
  createContext, useMemo, useState, useContext,
} from 'react';
import { NodeModels, RequiredActions } from '@gsuite/typings/files';

export type Crossing = {
  id?: string;
  number?: string;
  client?: string;
  clientNumber?: string;
  patente?: string;
  aduana?: string;
  user?: {
    id?: string;
    name?: string;
    lastName?: string;
  }
  trafficUser?: {
    id?: string;
    name?: string;
    lastName?: string;
  },
  customerUser?: {
    id?: string;
    name?: string;
    lastName?: string;
  }
  type?: string;
  trafficType?: string;
  status?: {
    _id?: string;
    name?: string;
    color?: string;
  };
  typeModulation?: string;
  nodes?: {
    tree?: NodeModels[];
    externalNode?: NodeModels[];
    dispatchFileNode?: NodeModels[];
  };
  maritimeFlow?: StepData[];
  sentDarwin?: boolean;
  history?: History[];
  createBy?: {
    name?: string;
    lastName?: string;
  }
  isWithoutTxtFlow?: boolean;
  requiredActions?: RequiredActions[],
};

export type File = {
  url: string;
  key: string;
};

export type StepData = {
  step: {
    label: string;
    key: string;
  };
  completed: boolean;
  status?: string;
  files?: File[];
  issuedAt?: Date;
  user?: string;
  data?: {
    emails?: string[];
    appointmentDate?: Date;
    eta?: Date
    inspection: boolean;
    containerNumber?: string;
    sailingDate?: Date;
    closingDate?: Date;
  };
  nextStatus?: string;
};

export type History = {
  user: UserHistory;
  action: string;
  operationDate: string;
  files: string[];
  comments: string;
};

export type UserHistory = {
  id: string;
  name: string;
  lastName: string;
};

type ValidateTxT = {
  id?: string;
  isValid: boolean;
  plates: string[];
  economic: string[];
  country: string[];
  closeDialog?: () => void;
  refetch?: () => void;
  updateHistoryCreate?: ((id: string, allFiles: string[], comments: string) => void)
  fileNames?: string[];
  comments?: string;
};

interface CrossingProviderProps {
  children: React.ReactNode;
  isCustomerFlow?: boolean;
  isTrafficFlow?: boolean;
}

interface ICrossingContext {
  crossing: Crossing | undefined;
  setCrossing: (crossing: Crossing) => void;
  dialogData?: ValidateTxT;
  setDialogData: (dialogData: ValidateTxT) => void;
  isCustomerFlow?: boolean;
  isTrafficFlow?: boolean;
}

export const defaultState: Crossing = {
  id: '',
  number: '',
  client: '',
  clientNumber: '',
  patente: '',
  aduana: '',
  type: '',
  user: {
    id: '',
    name: '',
    lastName: '',
  },
  trafficUser: {
    id: '',
    name: '',
    lastName: '',
  },
  customerUser: {
    id: '',
    name: '',
    lastName: '',
  },
  status: {
    _id: '',
    name: '',
    color: '',
  },
  trafficType: '',
  typeModulation: '',
  nodes: {
    tree: [],
    externalNode: [],
    dispatchFileNode: [],
  },
  sentDarwin: false,
  history: [],
  isWithoutTxtFlow: false,
};

const CrossingContext = createContext({} as ICrossingContext);

function CrossingProvider({
  children,
  isCustomerFlow = false,
  isTrafficFlow = false,
}: CrossingProviderProps) {
  const [crossing, setCrossing] = useState<Crossing>(defaultState);
  const [dialogData, setDialogData] = useState<ValidateTxT>();
  const values = useMemo<ICrossingContext>(() => ({
    crossing,
    setCrossing: (prevCrossing: Crossing) => setCrossing({
      ...prevCrossing,
    }),
    dialogData,
    setDialogData: (prevDialogData: ValidateTxT) => setDialogData({
      ...prevDialogData,
    }),
    isCustomerFlow,
    isTrafficFlow,
  }), [crossing, isCustomerFlow, isTrafficFlow, dialogData]);

  return (
    <CrossingContext.Provider value={values}>
      {children}
    </CrossingContext.Provider>
  );
}

function useCrossing() {
  const context = useContext(CrossingContext);
  if (context === undefined) {
    throw new Error('useCrossing must be used within a CrossingProvider');
  }
  return context;
}

export { CrossingContext, CrossingProvider, useCrossing };
