import { Skeleton } from '@mui/material';

type Props = {
  loadable?: boolean;
  initialComponent?: React.ReactNode | null;
  children: React.ReactNode;
};

export function Conditional({
  loadable = false,
  initialComponent = <Skeleton width="100%" height="100%" />,
  children,
}: Props): any {
  if (!loadable) {
    return initialComponent;
  }

  return children;
}

export default Conditional;
