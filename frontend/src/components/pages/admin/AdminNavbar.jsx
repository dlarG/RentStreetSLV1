import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

function AdminNavbar({ collapsed }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New landlord registration",
      description: "Maria Santos applied for approval",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Dispute filed",
      description: "Tenant disputes payment record #1234",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Property reported",
      description: "Listing #567 flagged for review",
      time: "3 hours ago",
      unread: false,
    },
  ];

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-ink/5 z-20 transition-all duration-300 ${
        collapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30"
            />
            <input
              type="text"
              placeholder="Search users, properties..."
              className="w-full rounded-xl border-1 pl-10 pr-4 py-2"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Messages */}
          <button className="cursor-pointer relative w-10 h-10 rounded-xl bg-mist/50 hover:bg-mist flex items-center justify-center transition-colors">
            <MessageSquare size={18} className="text-ink/60" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-bay text-white text-[10px] font-bold flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {/* Notifications */}
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

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border z-20 overflow-hidden">
                  <div className="p-4 border-b border-ink/5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button className="cursor-pointer text-xs text-bay font-semibold hover:text-bay-deep">
                        Mark all read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-ink/5 hover:bg-mist/50 transition-colors cursor-pointer ${
                          notif.unread ? "bg-bay/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              notif.unread ? "bg-bay" : "bg-ink/20"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink">
                              {notif.title}
                            </p>
                            <p className="text-xs text-ink/60 mt-0.5">
                              {notif.description}
                            </p>
                            <p className="text-xs text-ink/30 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/admin/notifications"
                    className="block text-center text-sm text-bay font-semibold p-3 hover:bg-mist/50 transition-colors"
                  >
                    View all notifications
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="cursor-pointer flex items-center gap-2 p-1.5 rounded-xl hover:bg-mist transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bay to-marigold flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-ink">Admin User</p>
                <p className="text-xs text-ink/40">Super Admin</p>
              </div>
              <ChevronDown size={16} className="text-ink/40 hidden sm:block" />
            </button>

            {showProfile && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-ink/5 z-20 overflow-hidden">
                  <div className="p-2">
                    <Link
                      to="/admin/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/60 hover:bg-mist hover:text-ink transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/60 hover:bg-mist hover:text-ink transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <Link
                      to="/admin/help"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/60 hover:bg-mist hover:text-ink transition-colors"
                    >
                      <HelpCircle size={16} />
                      Help
                    </Link>
                    <hr className="my-1 border-ink/5" />
                    <button className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                      <LogOut size={16} />
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

export default AdminNavbar;
