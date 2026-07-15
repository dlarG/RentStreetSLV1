import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Login from "./components/layouts/auth/Login";
import Register from "./components/layouts/auth/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Next routes will go here as we build them, e.g.: */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/browse" element={<BrowseRoomsPage />} /> */}
      {/* <Route path="/dashboard" element={<LandlordDashboardPage />} /> */}
    </Routes>
  );
}

export default App;
