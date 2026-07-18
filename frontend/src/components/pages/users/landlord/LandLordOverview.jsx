/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  ClipboardList,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Plus,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../../../lib/api";

function LandLordOverview() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeTenants: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "RentStreet | Landlord Dashboard";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get("/landlord/dashboard/stats"),
        api.get("/landlord/dashboard/recent-activity"),
      ]);
      setStats(statsRes.data);
      setRecentActivity(activityRes.data);
    } catch {
      // Use default empty data
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    { month: "Jan", amount: 12000 },
    { month: "Feb", amount: 15000 },
    { month: "Mar", amount: 14000 },
    { month: "Apr", amount: 18000 },
    { month: "May", amount: 16000 },
    { month: "Jun", amount: 20000 },
    { month: "Jul", amount: stats.monthlyRevenue },
  ];

  const quickActions = [
    {
      label: "Add Property",
      icon: Plus,
      path: "/landlord/properties/add",
      color: "bg-bay text-white",
    },
    {
      label: "View Applications",
      icon: ClipboardList,
      path: "/landlord/applications",
      color: "bg-white border-2 border-ink/10 text-ink",
    },
    {
      label: "Manage Tenants",
      icon: Users,
      path: "/landlord/tenants",
      color: "bg-white border-2 border-ink/10 text-ink",
    },
    {
      label: "Check Payments",
      icon: DollarSign,
      path: "/landlord/payments",
      color: "bg-white border-2 border-ink/10 text-ink",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-bay to-bay-deep rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-black font-display font-extrabold text-2xl sm:text-3xl mb-2">
              Welcome back, Landlord!
            </h1>
            <p className="text-black text-sm sm:text-base">
              Here's what's happening with your properties today.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-black text-xs font-semibold">
              {stats.totalProperties}{" "}
              {stats.totalProperties === 1 ? "Property" : "Properties"}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-marigold text-white text-xs font-semibold">
              Premium
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.path}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${action.color}`}
            >
              <Icon size={20} />
              <span className="text-xs font-semibold text-center">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          {
            label: "Total Properties",
            value: stats.totalProperties,
            icon: Building2,
            color: "bg-blue-50 text-blue-600",
            change: null,
          },
          {
            label: "Active Tenants",
            value: stats.activeTenants,
            icon: Users,
            color: "bg-green-50 text-green-600",
            change: "+2",
          },
          {
            label: "Pending Apps",
            value: stats.pendingApplications,
            icon: ClipboardList,
            color: "bg-orange-50 text-orange-600",
            change: null,
          },
          {
            label: "Monthly Revenue",
            value: `₱${stats.monthlyRevenue.toLocaleString()}`,
            icon: CreditCard,
            color: "bg-purple-50 text-purple-600",
            change: "+8.3%",
          },
          {
            label: "Occupancy",
            value: `${stats.occupancyRate}%`,
            icon: TrendingUp,
            color: "bg-teal-50 text-teal-600",
            change: null,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-ink/5"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  <Icon size={16} className="sm:w-5 sm:h-5" />
                </div>
                {stat.change && (
                  <div className="flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold rounded-full px-1.5 py-0.5 bg-green-50 text-green-600">
                    <ArrowUpRight size={10} /> {stat.change}
                  </div>
                )}
              </div>
              <p className="text-lg sm:text-2xl font-display font-extrabold">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-sm text-ink/40 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
          <h3 className="font-display font-bold text-base sm:text-lg mb-4">
            Revenue Overview
          </h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0E5C56"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base sm:text-lg">
              Recent Activity
            </h3>
            <Link
              to="/landlord/applications"
              className="text-xs sm:text-sm font-semibold text-bay"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-mist/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === "application"
                        ? "bg-blue-50 text-blue-600"
                        : activity.type === "payment"
                        ? "bg-green-50 text-green-600"
                        : activity.type === "move_in"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {activity.type === "application" && (
                      <ClipboardList size={14} />
                    )}
                    {activity.type === "payment" && <DollarSign size={14} />}
                    {activity.type === "move_in" && <UserCheck size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      {activity.description}
                    </p>
                    <p className="text-[10px] sm:text-xs text-ink/40">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/40 text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandLordOverview;
