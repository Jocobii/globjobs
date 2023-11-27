import loadable from '@loadable/component';
import LoadingScreen from '@/components/LoadingScreen';

const Table = loadable(() => import('./components/Table'), {
  fallback: <LoadingScreen />,
});

function Home() {
  return (
    <Table />
  );
}

export default Home;
