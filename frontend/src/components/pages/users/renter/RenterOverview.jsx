/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  ClipboardList,
  Home,
  Star,
  MapPin,
  Building2,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Circle,
  ClipboardCheck,
} from "lucide-react";
import api from "../../../../lib/api";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");

function RenterOverview() {
  const [stats, setStats] = useState({
    activeApplications: 0,
    favorites: 0,
    trustScore: 100,
    currentTenancy: null,
  });
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState(null);

  useEffect(() => {
    document.title = "RentStreet | Student Dashboard";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, nearbyRes, activityRes, profileRes] = await Promise.all([
        api.get("/renter/dashboard/stats"),
        api.get("/renter/properties/nearby?limit=3"),
        api.get("/renter/dashboard/recent-activity"),
        api.get("/renter/profile/completeness"),
      ]);
      setStats(statsRes.data);
      setNearbyProperties(nearbyRes.data);
      setRecentActivity(activityRes.data);
      setProfileStatus(profileRes.data);
    } catch {
      // Default empty state
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      label: "Find Rooms",
      icon: Search,
      path: "/renter/search",
      color: "bg-bay text-white",
    },
    {
      label: "My Favorites",
      icon: Heart,
      path: "/renter/favorites",
      color: "bg-white border-2 border-ink/10",
    },
    {
      label: "Applications",
      icon: ClipboardList,
      path: "/renter/applications",
      color: "bg-white border-2 border-ink/10",
    },
    {
      label: "My Room",
      icon: Home,
      path: "/renter/my-room",
      color: "bg-white border-2 border-ink/10",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-bay to-bay-deep rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[#14231f] font-display font-extrabold text-2xl sm:text-3xl mb-2">
              Find your perfect room!
            </h1>
            <p className="text-[#14231f] text-sm sm:text-base">
              Browse verified boarding houses near SLSU and apply in minutes.
            </p>
          </div>
          <Link
            to="/renter/search"
            className="inline-flex items-center gap-2 px-5 py-3 bg-marigold text-ink font-semibold rounded-xl hover:bg-white transition-colors text-sm"
          >
            <Search size={16} /> Browse Rooms
          </Link>
        </div>
      </div>
      {profileStatus && !profileStatus.is_complete && (
        <div className="bg-marigold/10 border-2 border-marigold/30 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-marigold flex items-center justify-center flex-shrink-0">
              <ClipboardCheck size={20} className="text-ink" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h3 className="font-display font-bold text-base sm:text-lg">
                  Complete your profile
                </h3>
                <span className="text-xs font-bold text-marigold flex-shrink-0">
                  {profileStatus.percent}%
                </span>
              </div>
              <p className="text-sm text-ink/60 mb-4">
                A complete profile helps us match you with rooms that actually
                fit — and helps landlords trust who they're renting to.
              </p>

              <div className="w-full h-1.5 rounded-full bg-white mb-4 overflow-hidden">
                <div
                  className="h-full bg-marigold transition-all duration-500"
                  style={{ width: `${profileStatus.percent}%` }}
                />
              </div>

              <ul className="space-y-1.5 mb-4">
                {profileStatus.checklist.map((item) => (
                  <li
                    key={item.field}
                    className="flex items-center gap-2 text-sm"
                  >
                    {item.done ? (
                      <CheckCircle2
                        size={15}
                        className="text-green-600 flex-shrink-0"
                      />
                    ) : (
                      <Circle size={15} className="text-ink/30 flex-shrink-0" />
                    )}
                    <span
                      className={
                        item.done ? "text-ink/40 line-through" : "text-ink"
                      }
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/renter/settings"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-bay hover:text-bay-deep transition-colors"
              >
                Complete now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Active Applications",
            value: stats.activeApplications,
            icon: ClipboardList,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Saved Favorites",
            value: stats.favorites,
            icon: Heart,
            color: "bg-red-50 text-red-600",
          },
          {
            label: "Trust Score",
            value: stats.trustScore,
            icon: Star,
            color: "bg-green-50 text-green-600",
            suffix: "/100",
          },
          {
            label: "Current Room",
            value: stats.currentTenancy ? "Active" : "None",
            icon: Home,
            color: "bg-purple-50 text-purple-600",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-ink/5"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.color} flex items-center justify-center mb-3`}
              >
                <Icon size={16} className="sm:w-5 sm:h-5" />
              </div>
              <p className="text-lg sm:text-2xl font-display font-extrabold">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="text-[10px] sm:text-sm text-ink/40 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Nearby Properties + Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Nearby Properties */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
              <MapPin size={18} className="text-bay" /> Near SLSU Campus
            </h3>
            <Link
              to="/renter/search"
              className="text-xs sm:text-sm font-semibold text-bay flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {nearbyProperties.length > 0 ? (
              nearbyProperties.map((p) => (
                <Link
                  key={p.id}
                  to={`/renter/search?property=${p.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-mist/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-mist flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.cover_image_url ? (
                      <img
                        src={`${API_ORIGIN}${p.cover_image_url}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 size={20} className="text-ink/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-ink/40 truncate">
                      {p.barangay}, {p.municipality}
                    </p>
                    <p className="text-xs font-bold text-bay mt-0.5">
                      ₱{p.min_price?.toLocaleString()}/mo
                    </p>
                  </div>
                  <div className="text-xs text-ink/30 flex-shrink-0">
                    {p.distance_km?.toFixed(1)} km
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-ink/40 text-center py-6">
                No nearby properties found
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base sm:text-lg">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-mist/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      a.type === "application"
                        ? "bg-blue-50 text-blue-600"
                        : a.type === "payment"
                        ? "bg-green-50 text-green-600"
                        : a.type === "move_in"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {a.type === "application" && <ClipboardList size={14} />}
                    {a.type === "payment" && <DollarSign size={14} />}
                    {a.type === "move_in" && <Home size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      {a.description}
                    </p>
                    <p className="text-[10px] sm:text-xs text-ink/40">
                      {a.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/40 text-center py-6">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trust Score Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-ink/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
              <Star
                size={28}
                className="sm:w-8 sm:h-8 text-white"
                fill="white"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl">
                Trust Score
              </h3>
              <p className="text-sm text-ink/60">
                Your rental reputation — private & disputable
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-green-600">
              {stats.trustScore}
            </p>
            <p className="text-xs text-ink/40">out of 100</p>
          </div>
        </div>
        <Link
          to="/renter/trust-score"
          className="inline-flex items-center gap-1 text-sm font-semibold text-bay mt-4 hover:text-bay-deep transition-colors"
        >
          View details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default RenterOverview;
