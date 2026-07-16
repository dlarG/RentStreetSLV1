import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Mail,
  Phone,
  Building2,
  UserCheck,
  UserX,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import api from "../../../lib/api";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const TABS = [
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

function LandLordManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [landlords, setLandlords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    document.title = "RentStreet Admin | Landlord Management";
  }, []);

  const fetchLandlords = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    api
      .get("/admin/landlords", {
        params: {
          status: activeTab,
          search: searchQuery,
          page,
          page_size: pageSize,
        },
      })
      .then((res) => {
        setLandlords(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setErrorMsg("Couldn't load landlords. Try refreshing."))
      .finally(() => setLoading(false));
  }, [activeTab, searchQuery, page]);

  useEffect(() => {
    fetchLandlords();
  }, [fetchLandlords]);

  // Debounce search so we're not firing a request per keystroke
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const viewDetails = async (landlord) => {
    setShowDetailsModal(true);
    setSelectedLandlord(null); // shows a loading state in the modal while the full record loads
    try {
      const res = await api.get(`/admin/landlords/${landlord.id}`);
      setSelectedLandlord(res.data);
    } catch {
      setShowDetailsModal(false);
      setErrorMsg("Couldn't load that landlord's details.");
    }
  };

  const handleApprove = (landlord) => {
    setSelectedLandlord(landlord);
    setShowApproveModal(true);
  };
  const handleReject = (landlord) => {
    setSelectedLandlord(landlord);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/landlords/${selectedLandlord.id}/approve`);
      setShowApproveModal(false);
      setShowDetailsModal(false);
      setSelectedLandlord(null);
      fetchLandlords();
    } catch {
      setErrorMsg("Couldn't approve this landlord. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/landlords/${selectedLandlord.id}/reject`, {
        reason: rejectionReason,
      });
      setShowRejectModal(false);
      setShowDetailsModal(false);
      setSelectedLandlord(null);
      setRejectionReason("");
      fetchLandlords();
    } catch {
      setErrorMsg("Couldn't reject this landlord. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marigold/10 text-marigold text-xs font-semibold">
          <Clock size={12} />
          Pending Review
        </span>
      ),
      accepted: (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
          <Check size={12} />
          Approved
        </span>
      ),
      rejected: (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
          <X size={12} />
          Rejected
        </span>
      ),
    };
    return map[status] || null;
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
            Landlord Management
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            Review, approve, and manage landlord registrations.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
              activeTab === tab.value
                ? "border-bay bg-bay/5 shadow-lg shadow-bay/10"
                : "border-ink/5 bg-white hover:border-ink/10"
            }`}
          >
            <p className="text-sm font-semibold">{tab.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
        <div className="p-4 border-b border-ink/5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or business..."
              className="w-full rounded-xl border-2 border-ink/5 pl-10 pr-4 py-2.5 bg-mist/30 focus:bg-white focus:outline-none focus:border-bay/30 text-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="animate-spin text-bay" size={28} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5">
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Landlord
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Business
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Registered
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {landlords.map((landlord) => (
                  <tr
                    key={landlord.id}
                    className="hover:bg-mist/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {landlord.profile_photo_url ? (
                          <img
                            src={fileUrl(landlord.profile_photo_url)}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">
                              {landlord.full_name?.[0] || "?"}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {landlord.full_name}
                          </p>
                          <p className="text-xs text-ink/40 truncate">
                            {landlord.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-ink/30" />
                        <p className="text-sm font-medium text-ink">
                          {landlord.business_name || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(landlord.approval_status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-ink/40">
                        <Calendar size={14} />
                        {new Date(landlord.created_at).toLocaleDateString(
                          "en-PH",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(landlord)}
                          className="w-9 h-9 rounded-xl bg-mist/50 hover:bg-bay/10 hover:text-bay flex items-center justify-center transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        {landlord.approval_status !== "accepted" && (
                          <button
                            onClick={() => handleApprove(landlord)}
                            className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors"
                            title="Approve"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        {landlord.approval_status !== "rejected" && (
                          <button
                            onClick={() => handleReject(landlord)}
                            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                            title="Reject"
                          >
                            <UserX size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {landlords.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-mist flex items-center justify-center mx-auto mb-4">
                  <Building2 size={28} className="text-ink/20" />
                </div>
                <p className="text-ink/40 font-medium">No landlords found</p>
                <p className="text-sm text-ink/30 mt-1">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : `No ${activeTab} landlords right now.`}
                </p>
              </div>
            )}
          </div>
        )}

        {total > 0 && (
          <div className="px-6 py-4 border-t border-ink/5 flex items-center justify-between">
            <p className="text-sm text-ink/40">
              Showing {landlords.length} of {total} landlords
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-ink/60 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-ink/5 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="font-display font-bold text-xl">
                Landlord Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {!selectedLandlord ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-bay" size={28} />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  {selectedLandlord.profile_photo_url ? (
                    <img
                      src={fileUrl(selectedLandlord.profile_photo_url)}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {selectedLandlord.full_name?.[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-display font-bold text-xl">
                      {selectedLandlord.full_name}
                    </h4>
                    <p className="text-sm text-ink/60">
                      {selectedLandlord.business_name ||
                        "No business name provided"}
                    </p>
                    {getStatusBadge(selectedLandlord.approval_status)}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-mist/50">
                    <Mail size={18} className="text-ink/40" />
                    <div>
                      <p className="text-xs text-ink/40">Email</p>
                      <p className="text-sm font-medium">
                        {selectedLandlord.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-mist/50">
                    <Phone size={18} className="text-ink/40" />
                    <div>
                      <p className="text-xs text-ink/40">Phone</p>
                      <p className="text-sm font-medium">
                        {selectedLandlord.phone_number || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-ink/60 mb-3">
                    Uploaded Documents
                  </h5>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Valid Government ID",
                        url: selectedLandlord.valid_id_url,
                      },
                      {
                        label: "Business Permit / Registration",
                        url: selectedLandlord.business_permit_url,
                      },
                    ].map((doc) => (
                      <div
                        key={doc.label}
                        className="flex items-center justify-between p-3 rounded-xl bg-mist/50"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-ink/40" />
                          <span className="text-sm font-medium">
                            {doc.label}
                          </span>
                        </div>
                        {doc.url ? (
                          <a
                            href={fileUrl(doc.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-bay hover:text-bay-deep transition-colors"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-ink/30">
                            Not uploaded
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedLandlord.approval_status === "rejected" &&
                  selectedLandlord.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">
                        Rejection reason
                      </p>
                      <p className="text-sm text-red-700">
                        {selectedLandlord.rejection_reason}
                      </p>
                    </div>
                  )}

                <div className="flex gap-3 pt-4 border-t border-ink/5">
                  {selectedLandlord.approval_status !== "accepted" && (
                    <button
                      onClick={() => handleApprove(selectedLandlord)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                    >
                      <Check size={18} /> Approve Landlord
                    </button>
                  )}
                  {selectedLandlord.approval_status !== "rejected" && (
                    <button
                      onClick={() => handleReject(selectedLandlord)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                    >
                      <X size={18} /> Reject Landlord
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => !actionLoading && setShowApproveModal(false)}
          />
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <UserCheck size={28} className="text-green-600" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Approve Landlord
              </h3>
              <p className="text-sm text-ink/60">
                Approve{" "}
                <span className="font-semibold text-ink">
                  {selectedLandlord.full_name}
                </span>
                ? They'll be able to list properties immediately.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}{" "}
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => !actionLoading && setShowRejectModal(false)}
          />
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <UserX size={28} className="text-red-600" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Reject Landlord
              </h3>
              <p className="text-sm text-ink/60">
                Reason for rejecting{" "}
                <span className="font-semibold text-ink">
                  {selectedLandlord.full_name}
                </span>
                . This will be shown to the landlord.
              </p>
            </div>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Business permit expired, ID unreadable..."
              rows={3}
              className="w-full mt-4 rounded-xl border-2 border-ink/10 px-4 py-3 bg-mist/30 focus:bg-white focus:outline-none focus:border-red-300 text-sm resize-none transition-all"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim() || actionLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}{" "}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandLordManagement;
