import { useNavigate, redirect } from 'react-router-dom';

export function useCustomNavigate() {
  const navigate = useNavigate();

  const goTo = (path: string) => navigate(path);

  const reDirect = (path: string) => redirect(path);

  return {
    goTo,
    reDirect,
  };
}
