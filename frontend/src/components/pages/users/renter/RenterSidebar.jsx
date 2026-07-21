import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Heart,
  ClipboardList,
  Home,
  CreditCard,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import api from "../../../../lib/api";

function RenterSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();
  const [pendingApplications, setPendingApplications] = useState(0);
  const [, setUnreadNotifications] = useState(0);

  const sidebarLinks = [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/renter" },
        { label: "Find Rooms", icon: Search, path: "/renter/search" },
      ],
    },
    {
      section: "My Rentals",
      items: [
        { label: "My Room", icon: Home, path: "/renter/my-room" },
        {
          label: "Applications",
          icon: ClipboardList,
          path: "/renter/applications",
          badge: pendingApplications > 0 ? pendingApplications : null,
          badgeColor: "bg-marigold text-ink",
        },
        { label: "Favorites", icon: Heart, path: "/renter/favorites" },
      ],
    },
    {
      section: "Finance",
      items: [
        { label: "Payments", icon: CreditCard, path: "/renter/payments" },
        { label: "My Trust Score", icon: Star, path: "/renter/trust-score" },
      ],
    },
    {
      section: "Settings",
      items: [{ label: "Account", icon: Settings, path: "/renter/settings" }],
    },
  ];

  useEffect(() => {
    let cancelled = false;
    const fetchCounts = async () => {
      try {
        const [appRes, notifRes] = await Promise.all([
          api.get("/renter/applications/pending-count"),
          api.get("/renter/notifications/unread-count"),
        ]);
        if (!cancelled) {
          setPendingApplications(appRes.data.count);
          setUnreadNotifications(notifRes.data.count);
        }
      } catch {
        // Silent fail
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center gap-3 px-4 border-b border-ink/5 flex-shrink-0">
        <button
          onClick={onMobileClose}
          className="lg:hidden w-8 h-8 rounded-lg bg-mist flex items-center justify-center hover:bg-bay/10 transition-colors flex-shrink-0"
        >
          <X size={16} className="text-ink/60" />
        </button>
        <button
          onClick={onToggle}
          className="hidden lg:flex w-8 h-8 rounded-lg bg-mist items-center justify-center hover:bg-bay/10 transition-colors flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight size={16} className="text-ink/60" />
          ) : (
            <ChevronLeft size={16} className="text-ink/60" />
          )}
        </button>
        {!collapsed && (
          <Link
            to="/renter"
            className="flex items-center gap-2"
            onClick={onMobileClose}
          >
            <div className="w-8 h-8 rounded-full bg-bay flex items-center justify-center overflow-hidden">
              <img
                src="/asset/logo/5-circled-modified.png"
                alt=""
                className="w-7 h-7 object-cover rounded-full"
              />
            </div>
            <span className="font-display font-extrabold text-sm">
              <span className="text-papaya">Rent</span>Street
            </span>
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {sidebarLinks.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="text-xs font-semibold text-ink/30 uppercase tracking-wider mb-2 px-3">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-bay text-white shadow-lg shadow-bay/20"
                        : "text-ink/60 hover:bg-mist hover:text-ink"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-ink/40 group-hover:text-ink"
                      }`}
                    />
                    {!collapsed && (
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
                    {collapsed && item.badge && (
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
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 z-30 h-screen bg-white border-r border-ink/5 transition-all duration-300 flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-ink/5 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default RenterSidebar;
