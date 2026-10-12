import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { admin, checking } = useAuth();
  if (checking) return <p className="center-note">Checking your session…</p>;
  return admin ? children : <Navigate to="/admin/login" replace />;
}
