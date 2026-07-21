/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import RenterSidebar from "./RenterSidebar";
import RenterNavbar from "./RenterNavbar";

function TenantDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <RenterSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <RenterNavbar
        collapsed={sidebarCollapsed}
        onMenuClick={() => setMobileMenuOpen(true)}
      />
      <main
        className={`transition-all duration-300 pt-16 ${
          sidebarCollapsed ? "lg:ml-20 ml-0" : "lg:ml-64 ml-0"
        }`}
      >
        <div
          className="p-4 sm:p-6"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TenantDashboard;
