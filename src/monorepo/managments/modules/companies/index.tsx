import LoadingBackdrop from '@gsuite/shared/ui/CircularLoader';

import loadable from '@loadable/component';

const List = loadable(() => import('./components/List'), { fallback: <LoadingBackdrop /> });

export default function CompaniesHome() {
  return (
    <List />
  );
}
