import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsUserAuthenticated } from '../Redux/slices/UserSlice';


export const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  console.log(isAuthenticated);
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export const PrivateRoute = () => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  console.log(isAuthenticated);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};



