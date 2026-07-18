import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LandLordNavbar from "./LandLordNavbar";
import LandLordSidebar from "./LandLordSidebar";

function LandlordDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <LandLordSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <LandLordNavbar
        collapsed={sidebarCollapsed}
        onMenuClick={() => setMobileMenuOpen(true)}
      />
      <main
        className={`transition-all duration-300 pt-16 ${
          sidebarCollapsed ? "lg:ml-20 ml-0" : "lg:ml-64 ml-0"
        }`}
      >
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default LandlordDashboard;
