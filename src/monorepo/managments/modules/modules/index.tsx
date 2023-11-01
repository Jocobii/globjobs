import loadable from '@loadable/component';

const ModulesTable = loadable(() => import('./components/List'), { fallback: <h3>Loading...</h3> });

export default function ModulesHome() {
  return (
    <ModulesTable />
  );
}
