/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  Calendar,
  Loader2,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Undo2,
  MapPin,
  AlertTriangle,
  X,
  ChevronDown,
  Building2,
} from "lucide-react";
import api from "../../../../lib/api";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const TABS = [
  { value: "submitted", label: "Pending", icon: Clock, color: "bg-marigold" },
  { value: "viewed", label: "Viewed", icon: Eye, color: "bg-blue-500" },
  {
    value: "accepted",
    label: "Accepted",
    icon: CheckCircle,
    color: "bg-green-500",
  },
  { value: "rejected", label: "Rejected", icon: XCircle, color: "bg-red-500" },
  { value: "withdrawn", label: "Withdrawn", icon: Undo2, color: "bg-gray-400" },
];

const STATUS_CONFIG = {
  submitted: {
    color: "bg-marigold/10 text-marigold border-marigold/20",
    icon: Clock,
    label: "Pending Review",
  },
  viewed: {
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: Eye,
    label: "Viewed",
  },
  accepted: {
    color: "bg-green-50 text-green-600 border-green-200",
    icon: CheckCircle,
    label: "Accepted! 🎉",
  },
  rejected: {
    color: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
    label: "Rejected",
  },
  withdrawn: {
    color: "bg-gray-50 text-gray-400 border-gray-200",
    icon: Undo2,
    label: "Withdrawn",
  },
};

function RenterApplications() {
  const [activeTab, setActiveTab] = useState("submitted");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    document.title = "RentStreet | My Applications";
  }, []);

  const fetchApplications = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    api
      .get("/renter/applications", { params: { status_filter: activeTab } })
      .then((res) => setApplications(res.data))
      .catch(() => setErrorMsg("Couldn't load your applications."))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Calculate counts per status
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
            My Applications
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            Track the status of every room you've applied for.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-ink/10 text-sm font-semibold text-ink/60 hover:bg-mist transition-colors"
        >
          {TABS.find((t) => t.value === activeTab)?.label || "All"}
          <ChevronDown
            size={16}
            className={`transition-transform ${
              showMobileFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          {errorMsg}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = statusCounts[tab.value] || 0;
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`cursor-pointer relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left ${
                isActive
                  ? "border-papaya bg-papaya/5 shadow-lg shadow-papaya/10"
                  : "border-ink/5 bg-white hover:border-ink/10"
              }`}
            >
              {tab.color && (
                <div
                  className={`w-2 h-2 rounded-full ${tab.color} mb-2 sm:mb-3`}
                />
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Icon
                  size={14}
                  className={isActive ? "text-papaya" : "text-ink/30"}
                />
                <p className="text-lg sm:text-xl font-display font-extrabold text-ink">
                  {count}
                </p>
              </div>
              <p className="text-[10px] sm:text-xs text-ink/40 font-medium">
                {tab.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Dropdown */}
      {showMobileFilters && (
        <div className="sm:hidden bg-white rounded-2xl border border-ink/5 p-3 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setShowMobileFilters(false);
                }}
                className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-papaya/10 text-papaya"
                    : "text-ink/60 hover:bg-mist"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                <span className="ml-auto text-xs text-ink/30">
                  {statusCounts[tab.value] || 0}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-papaya" size={28} />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink/5 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-mist flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={28} className="text-ink/20" />
          </div>
          <p className="text-ink/40 font-medium">
            No {TABS.find((t) => t.value === activeTab)?.label.toLowerCase()}{" "}
            applications
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const statusInfo =
              STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-ink/5 overflow-hidden hover:shadow-md hover:shadow-ink/5 transition-all duration-300"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    {/* Property Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-mist flex-shrink-0 overflow-hidden relative">
                      {app.cover_image_url ? (
                        <img
                          src={fileUrl(app.cover_image_url)}
                          alt={app.boarding_house_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 size={24} className="text-ink/15" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="min-w-0">
                          <h3 className="font-display font-bold text-base sm:text-lg truncate">
                            {app.boarding_house_name}
                          </h3>
                          <p className="text-xs sm:text-sm text-ink/50 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} />
                            {app.room_label}
                          </p>
                        </div>
                        <span
                          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}
                        >
                          <StatusIcon size={12} />
                          <span className="hidden sm:inline">
                            {statusInfo.label}
                          </span>
                        </span>
                      </div>

                      {/* Price & Date */}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-sm font-bold text-papaya">
                          ₱{app.monthly_rate?.toLocaleString()}
                          <span className="text-xs font-normal text-ink/40">
                            /mo
                          </span>
                        </span>
                        <span className="text-xs text-ink/30 flex items-center gap-1">
                          <Calendar size={12} />
                          Applied{" "}
                          {new Date(app.applied_at).toLocaleDateString(
                            "en-PH",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        {app.decided_at && (
                          <span className="text-xs text-ink/30">
                            · Updated{" "}
                            {new Date(app.decided_at).toLocaleDateString(
                              "en-PH",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </div>

                      {/* Message Preview */}
                      {app.message && (
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : app.id)
                          }
                          className="cursor-pointer mt-2 text-xs text-ink/40 hover:text-papaya transition-colors flex items-center gap-1"
                        >
                          {isExpanded ? "Hide message" : "View message"}
                          <ChevronDown
                            size={12}
                            className={`transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Message */}
                  {isExpanded && app.message && (
                    <div className="mt-4 p-4 rounded-xl bg-mist/50 border border-ink/5">
                      <p className="text-xs text-ink/40 font-medium mb-1">
                        Your message to the landlord:
                      </p>
                      <p className="text-sm text-ink/70">{app.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {(app.status === "submitted" || app.status === "viewed") && (
                    <div className="mt-4 pt-4 border-t border-ink/5 flex justify-end">
                      <button
                        onClick={() => setWithdrawTarget(app)}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <Undo2 size={13} />
                        Withdraw Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawTarget && (
        <WithdrawModal
          application={withdrawTarget}
          onClose={() => setWithdrawTarget(null)}
          onDone={() => {
            setWithdrawTarget(null);
            fetchApplications();
          }}
        />
      )}
    </div>
  );
}

function WithdrawModal({ application, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const confirmWithdraw = async () => {
    setLoading(true);
    setError("");
    try {
      await api.patch(`/renter/applications/${application.id}/withdraw`);
      onDone();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Couldn't withdraw this application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-sm shadow-2xl p-6 transition-all duration-200 ${
          isClosing
            ? "animate-slide-down opacity-0 scale-95"
            : "animate-slide-up opacity-100 scale-100"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="cursor-pointer absolute top-4 right-4 w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        <div className="text-center pt-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>

          <h3 className="font-display font-bold text-xl mb-2">
            Withdraw Application?
          </h3>
          <p className="text-sm text-ink/60 leading-relaxed">
            You're about to withdraw your application for{" "}
            <span className="font-semibold text-ink">
              {application.boarding_house_name}
            </span>
            . This property will reappear in your search results and you can
            re-apply later.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mt-4 text-left">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            disabled={loading}
            className="cursor-pointer flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold text-sm hover:bg-mist transition-colors disabled:opacity-50"
          >
            Keep Application
          </button>
          <button
            onClick={confirmWithdraw}
            disabled={loading}
            className="cursor-pointer flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Undo2 size={14} /> Withdraw
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RenterApplications;
