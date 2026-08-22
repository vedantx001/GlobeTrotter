import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (Unauthenticated only) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<div className="text-center p-4">Register Route</div>} />
        </Route>
      </Route>

      {/* Shared Public Routes (Accessible by anyone) */}
      <Route path="/trips/share/:token" element={<div className="p-8 text-center bg-ivory min-h-screen">Shared Trip Route</div>} />

      {/* Protected Routes (Authenticated only) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<div className="p-4">Dashboard Route Content</div>} />
        </Route>
      </Route>

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
