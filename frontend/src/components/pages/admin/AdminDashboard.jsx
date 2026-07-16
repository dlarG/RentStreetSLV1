import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <AdminNavbar collapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
