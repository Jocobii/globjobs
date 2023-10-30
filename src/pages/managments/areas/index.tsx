import loadable from '@loadable/component';
import DataGridSkeleton from './components/DataGridSkeleton';

const AreasList = loadable(() => import('./List'), { fallback: <DataGridSkeleton /> });

export default function AreasHome() {
  return ( <AreasList />);
}
