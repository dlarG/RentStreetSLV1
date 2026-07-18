import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/layouts/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./components/layouts/auth/RegisterPage";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import LandLordDashboard from "./components/pages/users/LandLordDashboard";
import LandlordOverview from "./components/pages/users/LandLordOverview";
import PropertyManagement from "./components/pages/users/PropertyManagement";
import MyTenants from "./components/pages/users/MyTenant";

import TenantDashboard from "./components/pages/users/TenantDashboard";
import AdminOverview from "./components/pages/admin/AdminOverview";
import LandLordManagement from "./components/pages/admin/LandLordManagement";
import NotFound from "./components/pages/NotFound";
import TenantManagement from "./components/pages/admin/TenantManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="landlords-management" element={<LandLordManagement />} />
        <Route path="tenants-management" element={<TenantManagement />} />
      </Route>
      {/* Landlord Routes */}
      <Route
        path="/landlord"
        element={
          <ProtectedRoute allowedRoles={["landlord"]} requireApproved>
            <LandLordDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<LandlordOverview />} />
        <Route path="properties" element={<PropertyManagement />} />
        <Route path="tenants" element={<MyTenants />} />
      </Route>
      {/* Renter routes */}
      <Route
        path="/renter"
        element={
          <ProtectedRoute allowedRoles={["renter"]}>
            <TenantDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
