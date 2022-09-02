import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/auth';

export const LoggedIn = () => {
  const { isLoggedIn } = useAuth();
  const { pathname, hash } = useLocation();

  if (isLoggedIn) {
    return <Outlet />;
  }

  return <Navigate replace to={`/?return=${encodeURIComponent(`${pathname}${hash}`)}`} />;
};
