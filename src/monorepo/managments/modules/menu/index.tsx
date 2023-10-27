import loadable from '@loadable/component';

const MainTable = loadable(() => import('./components/List'), { fallback: <h3>Loading...</h3> });

export default function MenuHome() {
  return (
    <MainTable />
  );
}
