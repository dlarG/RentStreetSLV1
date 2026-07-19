import { Routes, Route } from "react-router-dom";
// Landing Page
import LandingPage from "./components/pages/LandingPage";

// Auths
import LoginPage from "./components/layouts/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./components/layouts/auth/RegisterPage";

// Tenant Component Import
import TenantDashboard from "./components/pages/users/TenantDashboard";

// Admin Components Import
import AdminOverview from "./components/pages/admin/AdminOverview";
import LandLordManagement from "./components/pages/admin/LandLordManagement";
import NotFound from "./components/pages/NotFound";
import TenantManagement from "./components/pages/admin/TenantManagement";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import AdminPropertyManagement from "./components/pages/admin/AdminPropertyManagement";

// Landlord components import
import LandLordDashboard from "./components/pages/users/landlord/LandLordDashboard";
import LandLordOverview from "./components/pages/users/landlord/LandLordOverview";
import PropertyManagement from "./components/pages/users/landlord/PropertyManagement";
// import MyTenants from "./components/pages/users/MyTenant";

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
        <Route
          path="property-management"
          element={<AdminPropertyManagement />}
        />
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
        <Route index element={<LandLordOverview />} />
        <Route path="properties" element={<PropertyManagement />} />
        {/* <Route path="tenants" element={<MyTenants />} /> */}
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
