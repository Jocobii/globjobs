import LoadingBackdrop from '@gsuite/ui/LoadingBackdrop';

import loadable from '@loadable/component';

const List = loadable(() => import('./components/List'), { fallback: <LoadingBackdrop /> });

export default function CompaniesHome() {
  return (
    <List />
  );
}
