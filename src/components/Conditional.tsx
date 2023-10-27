import { Skeleton } from '@mui/material';

type Props = {
  loadable?: boolean;
  initialComponent?: React.ReactNode;
  children: React.ReactNode;
};

function Conditional({
  loadable = false,
  initialComponent = <Skeleton width="100%" height="100%" />,
  children,
}: Props): React.ReactNode {
  if (!loadable) {
    return initialComponent;
  }

  return children;
}

export default Conditional;
