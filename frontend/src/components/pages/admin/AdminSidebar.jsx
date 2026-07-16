import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  Flag,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MapPin,
} from "lucide-react";
import api from "../../../lib/api";

const sidebarLinks = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin",
      },
      {
        label: "Analytics",
        icon: BarChart3,
        path: "/admin/analytics",
      },
    ],
  },
  {
    section: "Management",
    items: [
      {
        label: "Landlords",
        icon: Building2,
        path: "/admin/landlords",
        badge: 3,
        badgeColor: "bg-marigold text-ink",
      },
      {
        label: "Tenants",
        icon: Users,
        path: "/admin/tenants",
      },
      {
        label: "Properties",
        icon: Building2,
        path: "/admin/properties",
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
      {
        label: "Approvals",
        icon: ClipboardCheck,
        path: "/admin/approvals",
        badge: 5,
        badgeColor: "bg-red-500 text-white",
      },
      {
        label: "Disputes",
        icon: ShieldCheck,
        path: "/admin/disputes",
        badge: 2,
        badgeColor: "bg-orange-500 text-white",
      },
      {
        label: "Reports",
        icon: Flag,
        path: "/admin/reports",
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        label: "Settings",
        icon: Settings,
        path: "/admin/settings",
      },
    ],
  },
];

function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

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
          path: "/admin/landlords",
          badge: pendingCount > 0 ? pendingCount : null,
          badgeColor: "bg-marigold text-ink",
        },
        { label: "Tenants", icon: Users, path: "/admin/tenants" },
        { label: "Properties", icon: Building2, path: "/admin/properties" },
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
  useEffect(() => {
    let cancelled = false;

    const fetchCount = () => {
      api
        .get("/admin/landlords/pending-count")
        .then((res) => {
          if (!cancelled) setPendingCount(res.data.count);
        })
        .catch(() => {}); // silent — a stale/missing badge isn't worth surfacing an error for
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000); // refresh every 30s so it doesn't go stale mid-session
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-white border-r border-ink/5 transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-ink/5 flex-shrink-0">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-mist flex items-center justify-center hover:bg-bay/10 transition-colors flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight size={16} className="text-ink/60" />
          ) : (
            <ChevronLeft size={16} className="text-ink/60" />
          )}
        </button>
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-bay flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-sm">
              <span className="text-bay">Rent</span>Street
            </span>
          </Link>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
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
                        <span className="text-sm font-medium flex-1">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
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
                    {isActive && !collapsed && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-ink/5 p-3 flex-shrink-0">
        <button
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink/60 hover:bg-red-50 hover:text-red-600 transition-colors w-full ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
