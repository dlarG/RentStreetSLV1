/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Home, Calendar, Loader2 } from "lucide-react";
import api from "../../../../lib/api";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "submitted" },
  { label: "Viewed", value: "viewed" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Withdrawn", value: "withdrawn" },
];

const STATUS_STYLES = {
  submitted: "bg-marigold/10 text-marigold",
  viewed: "bg-blue-50 text-blue-600",
  accepted: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-600",
  withdrawn: "bg-ink/5 text-ink/40",
};

function RenterApplications() {
  const [activeTab, setActiveTab] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [withdrawTarget, setWithdrawTarget] = useState(null);

  useEffect(() => {
    document.title = "RentStreet | My Applications";
  }, []);

  const fetchApplications = useCallback(() => {
    setLoading(true);
    api
      .get("/renter/applications", { params: { status_filter: activeTab } })
      .then((res) => setApplications(res.data))
      .catch(() => setErrorMsg("Couldn't load your applications."))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          My Applications
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Track the status of every room you've applied for.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.value
                ? "bg-bay text-white"
                : "bg-white border-2 border-ink/10 text-ink/60 hover:border-ink/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-bay" size={28} />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink/5 py-16 text-center">
          <ClipboardList size={28} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/40 font-medium">No applications here yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-ink/5 p-4 flex items-center gap-4"
            >
              {app.cover_image_url ? (
                <img
                  src={fileUrl(app.cover_image_url)}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-mist flex items-center justify-center flex-shrink-0">
                  <Home size={20} className="text-ink/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold truncate">
                    {app.boarding_house_name}
                  </p>
                  <span
                    className={`flex-shrink-0 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[app.status]
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-ink/50">
                  {app.room_label} · ₱{app.monthly_rate.toLocaleString()}/mo
                </p>
                <p className="text-xs text-ink/30 flex items-center gap-1 mt-1">
                  <Calendar size={11} /> Applied{" "}
                  {new Date(app.applied_at).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {(app.status === "submitted" || app.status === "viewed") && (
                <button
                  onClick={() => setWithdrawTarget(app)}
                  className="flex-shrink-0 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>
      )}

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
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <h3 className="font-display font-bold text-lg mb-1">
          Withdraw application?
        </h3>
        <p className="text-sm text-ink/60">
          Withdraw your application for{" "}
          <span className="font-semibold text-ink">
            {application.boarding_house_name}
          </span>
          ? This property will reappear in your search results.
        </p>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold text-sm hover:bg-mist transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmWithdraw}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Withdraw"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RenterApplications;
