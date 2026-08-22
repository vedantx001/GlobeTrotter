import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../pages/DashboardPage';
import CreateTripPage from '../pages/trips/CreateTripPage';
import ItineraryBuilderPage from '../pages/trips/ItineraryBuilderPage';
import MyTripsPage from '../pages/trips/MyTripsPage';
import ItineraryViewPage from '../pages/trips/ItineraryViewPage';
import CommunityPage from '../pages/community/CommunityPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ExplorePage from '../pages/explore/ExplorePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (Unauthenticated only) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Shared Public Routes (Accessible by anyone) */}
      <Route path="/trips/share/:token" element={<div className="p-8 text-center bg-ivory min-h-screen">Shared Trip Route</div>} />

      {/* Protected Routes (Authenticated only) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/trips/new" element={<CreateTripPage />} />
          <Route path="/builder/:tripId" element={<ItineraryBuilderPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          
          {/* Future Route Placeholders (Prevent 404 redirect) */}
          <Route path="/trips/:id" element={<ItineraryViewPage />} />
        </Route>
      </Route>

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
