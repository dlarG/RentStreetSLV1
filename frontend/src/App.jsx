import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/layouts/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder dashboards — replace with real ones as you build them
const AdminDashboard = () => <div className="p-10">Admin Dashboard</div>;
const LandlordDashboard = () => <div className="p-10">Landlord Dashboard</div>;
const StudentDashboard = () => <div className="p-10">Student Dashboard</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/landlord"
        element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <LandlordDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/renter"
        element={
          <ProtectedRoute allowedRoles={["renter"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
