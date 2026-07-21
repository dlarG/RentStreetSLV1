import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, ChevronDown, User, Menu, Heart } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");

function RenterNavbar({ collapsed, onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();

  const notifications = [
    {
      id: 1,
      title: "Application viewed",
      description: "Your application for Santos Boarding House was viewed",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment due soon",
      description: "Your rent is due in 3 days",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "New property nearby",
      description: "3 new rooms added near SLSU campus",
      time: "1 day ago",
      unread: false,
    },
  ];

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-ink/5 z-20 transition-all duration-300 ${
        collapsed ? "lg:left-20 left-0" : "lg:left-64 left-0"
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-mist/50 hover:bg-mist flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Menu size={20} className="text-ink/60" />
        </button>

        <div className="hidden sm:flex flex-1 max-w-md">
          <Link to="/renter/search" className="relative w-full">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30"
            />
            <input
              type="text"
              placeholder="Search rooms near SLSU..."
              readOnly
              className="w-full rounded-xl border border-ink/10 pl-10 pr-4 py-2 bg-mist/30 cursor-pointer text-sm"
            />
          </Link>
        </div>

        <Link
          to="/renter/search"
          className="sm:hidden w-10 h-10 rounded-xl bg-mist/50 hover:bg-mist flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Search size={20} className="text-ink/60" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            to="/renter/favorites"
            className="hidden sm:flex cursor-pointer relative w-10 h-10 rounded-xl bg-mist/50 hover:bg-mist items-center justify-center transition-colors"
          >
            <Heart size={18} className="text-ink/60" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="cursor-pointer relative w-10 h-10 rounded-xl bg-mist/50 hover:bg-mist flex items-center justify-center transition-colors"
            >
              <Bell size={18} className="text-ink/60" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                2
              </span>
            </button>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border z-20 overflow-hidden">
                  <div className="p-4 border-b border-ink/5">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-ink/5 hover:bg-mist/50 cursor-pointer ${
                          n.unread ? "bg-bay/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              n.unread ? "bg-bay" : "bg-ink/20"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-semibold">{n.title}</p>
                            <p className="text-xs text-ink/60">
                              {n.description}
                            </p>
                            <p className="text-xs text-ink/30 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="cursor-pointer flex items-center gap-2 p-1.5 rounded-xl hover:bg-mist transition-colors"
            >
              {user?.profile_photo_url ? (
                <img
                  src={`${API_ORIGIN}${user.profile_photo_url}`}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bay to-marigold flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
              )}
              <div className="hidden sm:block text-left min-w-0">
                <p className="text-sm font-semibold truncate max-w-[120px]">
                  {user?.full_name || "Student"}
                </p>
                <p className="text-xs text-ink/40 truncate max-w-[120px]">
                  {user?.email || ""}
                </p>
              </div>
              <ChevronDown size={16} className="text-ink/40 hidden sm:block" />
            </button>
            {showProfile && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border z-20 overflow-hidden">
                  <div className="p-2">
                    <Link
                      to="/renter/settings"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/60 hover:bg-mist"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/renter/trust-score"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/60 hover:bg-mist"
                    >
                      Trust Score
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default RenterNavbar;
