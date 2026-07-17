/* eslint-disable react-hooks/set-state-in-effect */
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  useEffect(() => {
    const isAnyModalOpen =
      showDetailsModal || showApproveModal || showRejectModal;

    if (isAnyModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Prevent layout shift
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [showDetailsModal, showApproveModal, showRejectModal]);

  // Close modals on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowDetailsModal(false);
        setShowApproveModal(false);
        setShowRejectModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
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

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const viewDetails = async (landlord) => {
    setShowDetailsModal(true);
    setSelectedLandlord(null);
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-marigold/10 text-marigold text-[10px] sm:text-xs font-semibold">
          <Clock size={10} className="sm:w-3 sm:h-3" />
          <span className="hidden sm:inline">Pending Review</span>
          <span className="sm:hidden">Pending</span>
        </span>
      ),
      accepted: (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-green-50 text-green-600 text-[10px] sm:text-xs font-semibold">
          <Check size={10} className="sm:w-3 sm:h-3" />
          Approved
        </span>
      ),
      rejected: (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-50 text-red-600 text-[10px] sm:text-xs font-semibold">
          <X size={10} className="sm:w-3 sm:h-3" />
          Rejected
        </span>
      ),
    };
    return map[status] || null;
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl">
            Landlord Management
          </h1>
          <p className="text-xs sm:text-sm text-ink/60 mt-1">
            Review, approve, and manage landlord registrations.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
          {errorMsg}
        </div>
      )}

      {/* Tabs - Scrollable on mobile */}
      <div className="flex gap-2 sm:grid sm:grid-cols-3 sm:gap-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`cursor-pointer flex-shrink-0 px-4 py-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left ${
              activeTab === tab.value
                ? "border-bay bg-bay/5 shadow-lg shadow-bay/10"
                : "border-ink/5 bg-white hover:border-ink/10"
            }`}
          >
            <p className="text-xs sm:text-sm font-semibold whitespace-nowrap">
              {tab.label}
            </p>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-ink/5 overflow-hidden">
        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-ink/5 flex items-center gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="cursor-pointer sm:hidden w-9 h-9 rounded-lg bg-mist/50 hover:bg-mist flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Search size={16} className="text-ink/40" />
          </button>

          {/* Desktop Search */}
          <div className="hidden sm:block relative flex-1 max-w-md">
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

          {/* Mobile Search Input (shown when toggled) */}
          {showMobileSearch && (
            <div className="sm:hidden relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search landlords..."
                autoFocus
                className="w-full rounded-lg border border-ink/10 pl-9 pr-3 py-2 bg-mist/30 focus:bg-white focus:outline-none focus:border-bay/30 text-xs transition-all"
              />
            </div>
          )}

          <span className="text-xs text-ink/30 flex-shrink-0 ml-auto">
            {total} {total === 1 ? "landlord" : "landlords"}
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="animate-spin text-bay" size={24} />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
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
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewDetails(landlord)}
                            className="cursor-pointer w-9 h-9 rounded-xl bg-mist/50 hover:bg-bay/10 hover:text-bay flex items-center justify-center transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          {landlord.approval_status !== "accepted" && (
                            <button
                              onClick={() => handleApprove(landlord)}
                              className="cursor-pointer w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors"
                              title="Approve"
                            >
                              <UserCheck size={16} />
                            </button>
                          )}
                          {landlord.approval_status !== "rejected" && (
                            <button
                              onClick={() => handleReject(landlord)}
                              className="cursor-pointer w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
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
            </div>

            {/* Mobile Card List */}
            <div className="sm:hidden divide-y divide-ink/5">
              {landlords.map((landlord) => (
                <div
                  key={landlord.id}
                  className="p-4 hover:bg-mist/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
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
                    {getStatusBadge(landlord.approval_status)}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink/40 mb-3">
                    <Building2 size={12} />
                    <span>{landlord.business_name || "—"}</span>
                    <span className="mx-1">•</span>
                    <Calendar size={12} />
                    <span>
                      {new Date(landlord.created_at).toLocaleDateString(
                        "en-PH",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewDetails(landlord)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-mist/50 hover:bg-bay/10 hover:text-bay text-xs font-medium transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    {landlord.approval_status !== "accepted" && (
                      <button
                        onClick={() => handleApprove(landlord)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 text-xs font-medium transition-colors"
                      >
                        <UserCheck size={14} />
                        Approve
                      </button>
                    )}
                    {landlord.approval_status !== "rejected" && (
                      <button
                        onClick={() => handleReject(landlord)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-colors"
                      >
                        <UserX size={14} />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {landlords.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-mist flex items-center justify-center mx-auto mb-4">
                  <Building2 size={24} className="sm:w-7 sm:h-7 text-ink/20" />
                </div>
                <p className="text-sm text-ink/40 font-medium">
                  No landlords found
                </p>
                <p className="text-xs text-ink/30 mt-1">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : `No ${activeTab} landlords right now.`}
                </p>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-ink/5 flex items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-ink/40 hidden min-[400px]:block">
              {landlords.length} of {total}
            </p>
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="cursor-pointer w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs sm:text-sm font-medium text-ink/60 px-1 sm:px-2 min-w-[60px] text-center">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl w-[calc(100%-2rem)] sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-2xl mx-4">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-ink/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <h3 className="font-display font-bold text-lg sm:text-xl truncate pr-2">
                Landlord Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="cursor-pointer w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-60px)] sm:max-h-[calc(80vh-60px)]">
              {!selectedLandlord ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-bay" size={24} />
                </div>
              ) : (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {selectedLandlord.profile_photo_url ? (
                      <img
                        src={fileUrl(selectedLandlord.profile_photo_url)}
                        alt=""
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg sm:text-xl font-bold">
                          {selectedLandlord.full_name?.[0]}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-lg sm:text-xl truncate">
                        {selectedLandlord.full_name}
                      </h4>
                      <p className="text-xs sm:text-sm text-ink/60 truncate">
                        {selectedLandlord.business_name ||
                          "No business name provided"}
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(selectedLandlord.approval_status)}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-mist/50">
                      <Mail
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] text-ink/40 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-ink/40">
                          Email
                        </p>
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {selectedLandlord.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-mist/50">
                      <Phone
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] text-ink/40 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-ink/40">
                          Phone
                        </p>
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {selectedLandlord.phone_number || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs sm:text-sm font-semibold text-ink/60 mb-2 sm:mb-3">
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
                          className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-mist/50 gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText
                              size={14}
                              className="sm:w-4 sm:h-4 text-ink/40 flex-shrink-0"
                            />
                            <span className="text-xs sm:text-sm font-medium truncate">
                              {doc.label}
                            </span>
                          </div>
                          {doc.url ? (
                            <a
                              href={fileUrl(doc.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-bay hover:text-bay-deep transition-colors flex-shrink-0"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-xs text-ink/30 flex-shrink-0">
                              N/A
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedLandlord.approval_status === "rejected" &&
                    selectedLandlord.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                        <p className="text-xs font-semibold text-red-700 mb-1">
                          Rejection reason
                        </p>
                        <p className="text-xs sm:text-sm text-red-700">
                          {selectedLandlord.rejection_reason}
                        </p>
                      </div>
                    )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-ink/5">
                    {selectedLandlord.approval_status !== "accepted" && (
                      <button
                        onClick={() => handleApprove(selectedLandlord)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        <Check size={16} /> Approve
                      </button>
                    )}
                    {selectedLandlord.approval_status !== "rejected" && (
                      <button
                        onClick={() => handleReject(selectedLandlord)}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        <X size={16} /> Reject
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => !actionLoading && setShowApproveModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl w-[calc(100%-2rem)] sm:max-w-md shadow-2xl p-5 sm:p-6 mx-4">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <UserCheck size={24} className="sm:w-7 sm:h-7 text-green-600" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl mb-2">
                Approve Landlord
              </h3>
              <p className="text-xs sm:text-sm text-ink/60">
                Approve{" "}
                <span className="font-semibold text-ink">
                  {selectedLandlord.full_name}
                </span>
                ? They'll be able to list properties immediately.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="cursor-pointer w-full px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors disabled:opacity-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                disabled={actionLoading}
                className="cursor-pointer w-full px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {actionLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => !actionLoading && setShowRejectModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl w-[calc(100%-2rem)] sm:max-w-md shadow-2xl p-5 sm:p-6 mx-4">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <UserX size={24} className="sm:w-7 sm:h-7 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl mb-2">
                Reject Landlord
              </h3>
              <p className="text-xs sm:text-sm text-ink/60">
                Reason for rejecting{" "}
                <span className="font-semibold text-ink">
                  {selectedLandlord.full_name}
                </span>
                .
              </p>
            </div>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Business permit expired, ID unreadable..."
              rows={3}
              className="w-full mt-4 rounded-xl border-2 border-ink/10 px-3 sm:px-4 py-2.5 sm:py-3 bg-mist/30 focus:bg-white focus:outline-none focus:border-red-300 text-xs sm:text-sm resize-none transition-all"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
                className="cursor-pointer w-full px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors disabled:opacity-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim() || actionLoading}
                className="cursor-pointer w-full px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {actionLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
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
