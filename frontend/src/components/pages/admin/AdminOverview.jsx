import { useEffect } from "react";
import {
  Users,
  Building2,
  ClipboardCheck,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const statsCards = [
  {
    label: "Total Users",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Properties",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Pending Approvals",
    value: "23",
    change: "-3.1%",
    trend: "down",
    icon: ClipboardCheck,
    color: "bg-orange-50 text-orange-600",
  },
  {
    label: "Monthly Revenue",
    value: "₱45,670",
    change: "+18.3%",
    trend: "up",
    icon: CreditCard,
    color: "bg-purple-50 text-purple-600",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "New landlord registration",
    user: "Maria Santos",
    time: "5 minutes ago",
    type: "registration",
  },
  {
    id: 2,
    action: "Dispute filed",
    user: "Juan Dela Cruz",
    time: "1 hour ago",
    type: "dispute",
  },
  {
    id: 3,
    action: "Property approved",
    user: "Pedro Reyes",
    time: "2 hours ago",
    type: "approval",
  },
  {
    id: 4,
    action: "Subscription upgraded",
    user: "Ana Gonzales",
    time: "3 hours ago",
    type: "subscription",
  },
  {
    id: 5,
    action: "Payment verified",
    user: "Carlos Mendoza",
    time: "4 hours ago",
    type: "payment",
  },
];

const occupancyData = [
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 85 },
  { month: "Mar", rate: 88 },
  { month: "Apr", rate: 90 },
  { month: "May", rate: 87 },
  { month: "Jun", rate: 92 },
  { month: "Jul", rate: 95 },
];

const revenueData = [
  { month: "Jan", amount: 28000 },
  { month: "Feb", amount: 32000 },
  { month: "Mar", amount: 35000 },
  { month: "Apr", amount: 38000 },
  { month: "May", amount: 42000 },
  { month: "Jun", amount: 45000 },
  { month: "Jul", amount: 45670 },
];

function AdminOverview() {
  useEffect(() => {
    document.title = "RentStreet Admin | Dashboard";
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-ink/5 text-sm self-start sm:self-auto">
          <MapPin size={16} className="text-bay flex-shrink-0" />
          <span className="text-ink/60">Sogod, Southern Leyte</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-ink/5 hover:shadow-lg hover:shadow-ink/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  <Icon size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div
                  className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold rounded-full px-2 py-0.5 ${
                    stat.trend === "up"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-lg sm:text-2xl font-display font-extrabold text-ink truncate">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-ink/40 mt-1 truncate">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Occupancy Rate Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg">
                Occupancy Rate
              </h3>
              <p className="text-xs sm:text-sm text-ink/40">Monthly average</p>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600 font-semibold">
              <TrendingUp size={14} className="sm:w-4 sm:h-4" />
              +5.3%
            </div>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  domain={[75, 100]}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#0E5C56"
                  strokeWidth={2}
                  dot={{ fill: "#0E5C56", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: "#0E5C56" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg">
                Monthly Revenue
              </h3>
              <p className="text-xs sm:text-sm text-ink/40">
                Subscription & listing fees
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600 font-semibold">
              <TrendingUp size={14} className="sm:w-4 sm:h-4" />
              +18.3%
            </div>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#0E5C56"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg">
              Recent Activity
            </h3>
            <p className="text-xs sm:text-sm text-ink/40">
              Latest actions across the platform
            </p>
          </div>
          <button className="text-xs sm:text-sm font-semibold text-bay hover:text-bay-deep transition-colors">
            View all
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-mist/50 transition-colors"
            >
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activity.type === "registration"
                    ? "bg-blue-50 text-blue-600"
                    : activity.type === "dispute"
                    ? "bg-orange-50 text-orange-600"
                    : activity.type === "approval"
                    ? "bg-green-50 text-green-600"
                    : activity.type === "subscription"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {activity.type === "registration" && (
                  <Users size={12} className="sm:w-4 sm:h-4" />
                )}
                {activity.type === "dispute" && (
                  <AlertCircle size={12} className="sm:w-4 sm:h-4" />
                )}
                {activity.type === "approval" && (
                  <ClipboardCheck size={12} className="sm:w-4 sm:h-4" />
                )}
                {activity.type === "subscription" && (
                  <CreditCard size={12} className="sm:w-4 sm:h-4" />
                )}
                {activity.type === "payment" && (
                  <CreditCard size={12} className="sm:w-4 sm:h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {activity.action}
                </p>
                <p className="text-xs text-ink/40 truncate">{activity.user}</p>
              </div>
              <span className="text-xs text-ink/30 flex-shrink-0">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
