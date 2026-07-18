import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  ShieldCheck,
  Flag,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../lib/api";

function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  const location = useLocation();
  const [landlordpendingCount, landlordsetPendingCount] = useState(0);
  const [propertypendingCount, propertysetPendingCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const landlordfetchCount = () => {
      api
        .get("/admin/landlords/pending-count")
        .then((res) => {
          if (!cancelled) landlordsetPendingCount(res.data.count);
        })
        .catch(() => {});
    };
    landlordfetchCount();
    const interval = setInterval(landlordfetchCount, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const propertyfetchCount = () => {
      api
        .get("/admin/properties/pending-count")
        .then((res) => {
          if (!cancelled) propertysetPendingCount(res.data.count);
        })
        .catch(() => {});
    };
    propertyfetchCount();
    const propertyinterval = setInterval(propertyfetchCount, 30000);
    return () => {
      cancelled = true;
      clearInterval(propertyinterval);
    };
  }, []);

  const sidebarLinks = [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
      ],
    },
    {
      section: "Management",
      items: [
        {
          label: "Landlords",
          icon: Building2,
          path: "/admin/landlords-management",
          badge: landlordpendingCount > 0 ? landlordpendingCount : null,
          badgeColor: "bg-marigold text-white",
        },
        { label: "Tenants", icon: Users, path: "/admin/tenants-management" },
        {
          label: "Properties",
          badge: propertypendingCount > 0 ? propertypendingCount : null,
          icon: Building2,
          path: "/admin/property-management",
          badgeColor: "bg-marigold text-white",
        },
        {
          label: "Subscriptions",
          icon: CreditCard,
          path: "/admin/subscriptions",
        },
      ],
    },
    {
      section: "Review & Trust",
      items: [
        { label: "Disputes", icon: ShieldCheck, path: "/admin/disputes" },
        { label: "Reports", icon: Flag, path: "/admin/reports" },
      ],
    },
    {
      section: "System",
      items: [{ label: "Settings", icon: Settings, path: "/admin/settings" }],
    },
  ];

  return (
    <>
      {/* Mobile backdrop — click to close, only rendered below lg */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobile}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-ink/5 flex flex-col
          transition-transform duration-300 lg:transition-[width] lg:duration-300 lg:translate-x-0
          w-64 ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Logo / header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-ink/5 flex-shrink-0">
          {/* Desktop collapse toggle — hidden on mobile, replaced by the X below */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-8 h-8 rounded-lg bg-mist items-center justify-center hover:bg-bay/10 transition-colors flex-shrink-0"
          >
            {collapsed ? (
              <ChevronRight size={16} className="text-ink/60" />
            ) : (
              <ChevronLeft size={16} className="text-ink/60" />
            )}
          </button>

          {(!collapsed || mobileOpen) && (
            <Link
              to="/admin"
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-full bg-bay flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/asset/logo/5-circled-modified.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-extrabold text-sm truncate">
                <span className="text-papaya">Rent</span>Street
              </span>
            </Link>
          )}

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-8 h-8 rounded-lg bg-mist flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0 ml-auto"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {sidebarLinks.map((section) => (
            <div key={section.section}>
              {(!collapsed || mobileOpen) && (
                <p className="text-xs font-semibold text-ink/30 uppercase tracking-wider mb-2 px-3">
                  {section.section}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  const showLabel = !collapsed || mobileOpen;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        isActive
                          ? "bg-bay text-white shadow-lg shadow-bay/20"
                          : "text-ink/60 hover:bg-mist hover:text-ink"
                      }`}
                      title={!showLabel ? item.label : undefined}
                    >
                      <Icon
                        size={20}
                        className={`flex-shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-ink/40 group-hover:text-ink"
                        }`}
                      />
                      {showLabel && (
                        <>
                          <span className="text-sm font-medium flex-1 truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {!showLabel && item.badge && (
                        <span
                          className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="border-t border-ink/5 p-3 flex-shrink-0"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <button
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink/60 hover:bg-red-50 hover:text-red-600 transition-colors w-full ${
              collapsed && !mobileOpen ? "lg:justify-center" : ""
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {(!collapsed || mobileOpen) && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
