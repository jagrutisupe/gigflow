import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { ReactElement } from 'react';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;