import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Next routes will go here as we build them, e.g.: */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/browse" element={<BrowseRoomsPage />} /> */}
      {/* <Route path="/dashboard" element={<LandlordDashboardPage />} /> */}
    </Routes>
  );
}

export default App;
