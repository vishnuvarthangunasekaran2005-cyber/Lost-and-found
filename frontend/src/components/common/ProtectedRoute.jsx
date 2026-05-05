// frontend/src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, roles }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (roles && !roles.some(r => currentUser.roles?.includes(r))) {
    return <Navigate to="/" replace />;
  }
  return children;
}
