import loadable from '@loadable/component';
import DataGridSkeleton from '@gsuite/ui/DataGridSkeleton';

const ListPage = loadable(() => import('./components/List'), { fallback: <DataGridSkeleton /> });

export default function DepartmentsHome() {
  return (
    <ListPage />
  );
}
