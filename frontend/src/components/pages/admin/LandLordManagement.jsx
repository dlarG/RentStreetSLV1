import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Check,
  X,
  Eye,
  Mail,
  Phone,
  MapPin,
  Clock,
  Building2,
  UserCheck,
  UserX,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock data - replace with API calls
const mockLandlords = [
  {
    id: 1,
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@email.com",
    phone: "+63 917 123 4567",
    businessName: "Santos Boarding House",
    address: "123 Rizal St., Sogod, Southern Leyte",
    status: "pending",
    registeredAt: "2026-07-14T10:30:00",
    propertyCount: 2,
    documents: ["business_permit.pdf", "valid_id.jpg"],
    avatar: null,
  },
  {
    id: 2,
    firstName: "Pedro",
    lastName: "Reyes",
    email: "pedro.reyes@email.com",
    phone: "+63 928 765 4321",
    businessName: "Reyes Dormitory",
    address: "456 Bonifacio Ave., Sogod, Southern Leyte",
    status: "pending",
    registeredAt: "2026-07-15T08:15:00",
    propertyCount: 1,
    documents: ["dti_registration.pdf"],
    avatar: null,
  },
  {
    id: 3,
    firstName: "Ana",
    lastName: "Gonzales",
    email: "ana.gonzales@email.com",
    phone: "+63 935 111 2233",
    businessName: "Gonzales Apartments",
    address: "789 Mabini St., Sogod, Southern Leyte",
    status: "accepted",
    registeredAt: "2026-07-01T14:00:00",
    propertyCount: 3,
    documents: ["business_permit.pdf", "valid_id.jpg"],
    avatar: null,
  },
  {
    id: 4,
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 945 888 9999",
    businessName: "Dela Cruz Boarding",
    address: "321 Aguinaldo St., Sogod, Southern Leyte",
    status: "rejected",
    registeredAt: "2026-07-10T16:45:00",
    propertyCount: 1,
    documents: ["valid_id.jpg"],
    avatar: null,
    rejectionReason: "Incomplete documents - Missing business permit",
  },
  {
    id: 5,
    firstName: "Elena",
    lastName: "Rivera",
    email: "elena.rivera@email.com",
    phone: "+63 956 444 5566",
    businessName: "Rivera Student Dorms",
    address: "567 Quezon Blvd., Sogod, Southern Leyte",
    status: "pending",
    registeredAt: "2026-07-16T09:00:00",
    propertyCount: 4,
    documents: ["business_permit.pdf", "dti_registration.pdf", "valid_id.jpg"],
    avatar: null,
  },
];

const tabs = [
  { label: "All", value: "all", count: 5 },
  { label: "Pending", value: "pending", count: 3, color: "bg-marigold" },
  { label: "Accepted", value: "accepted", count: 1, color: "bg-green-500" },
  { label: "Rejected", value: "rejected", count: 1, color: "bg-red-500" },
];

function LandLordManagement() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    document.title = "RentStreet Admin | Landlord Management";
  }, []);

  const filteredLandlords = mockLandlords.filter((landlord) => {
    const matchesTab = activeTab === "all" || landlord.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      `${landlord.firstName} ${landlord.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      landlord.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landlord.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = (landlord) => {
    setSelectedLandlord(landlord);
    setShowApproveModal(true);
  };

  const handleReject = (landlord) => {
    setSelectedLandlord(landlord);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    // API call to approve landlord
    console.log("Approving:", selectedLandlord.id);
    setShowApproveModal(false);
    setSelectedLandlord(null);
  };

  const confirmReject = () => {
    // API call to reject landlord
    console.log("Rejecting:", selectedLandlord.id, "Reason:", rejectionReason);
    setShowRejectModal(false);
    setSelectedLandlord(null);
    setRejectionReason("");
  };

  const viewDetails = (landlord) => {
    setSelectedLandlord(landlord);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-marigold/10 text-marigold text-xs font-semibold">
            <Clock size={12} />
            Pending Review
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
            <Check size={12} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
            <X size={12} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
            Landlord Management
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            Review, approve, and manage landlord registrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-ink/10 hover:border-ink/20 text-sm font-semibold text-ink/60 hover:text-ink transition-colors">
            <Filter size={16} />
            Filter
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bay text-white text-sm font-semibold hover:bg-bay-deep transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setCurrentPage(1);
            }}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
              activeTab === tab.value
                ? "border-bay bg-bay/5 shadow-lg shadow-bay/10"
                : "border-ink/5 bg-white hover:border-ink/10"
            }`}
          >
            {tab.color && (
              <div className={`w-2 h-2 rounded-full ${tab.color} mb-2`} />
            )}
            <p className="text-2xl font-display font-extrabold text-ink">
              {tab.count}
            </p>
            <p className="text-xs text-ink/40 font-medium mt-1">{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
        {/* Search Bar */}
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

        {/* Table */}
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
              {filteredLandlords.map((landlord) => (
                <tr
                  key={landlord.id}
                  className="hover:bg-mist/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">
                          {landlord.firstName[0]}
                          {landlord.lastName[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">
                          {landlord.firstName} {landlord.lastName}
                        </p>
                        <p className="text-xs text-ink/40">{landlord.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-ink/30" />
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {landlord.businessName}
                        </p>
                        <p className="text-xs text-ink/40">
                          {landlord.propertyCount}{" "}
                          {landlord.propertyCount === 1
                            ? "property"
                            : "properties"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(landlord.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-ink/40">
                      <Calendar size={14} />
                      {new Date(landlord.registeredAt).toLocaleDateString(
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
                        className="w-9 h-9 rounded-xl bg-mist/50 hover:bg-bay/10 hover:text-bay flex items-center justify-center transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      {landlord.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(landlord)}
                            className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors"
                            title="Approve"
                          >
                            <UserCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(landlord)}
                            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                            title="Reject"
                          >
                            <UserX size={16} />
                          </button>
                        </>
                      )}
                      {landlord.status === "accepted" && (
                        <button
                          onClick={() => handleReject(landlord)}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                          title="Revoke approval"
                        >
                          <UserX size={16} />
                        </button>
                      )}
                      {landlord.status === "rejected" && (
                        <button
                          onClick={() => handleApprove(landlord)}
                          className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors"
                          title="Reconsider & approve"
                        >
                          <UserCheck size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLandlords.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-mist flex items-center justify-center mx-auto mb-4">
              <Building2 size={28} className="text-ink/20" />
            </div>
            <p className="text-ink/40 font-medium">No landlords found</p>
            <p className="text-sm text-ink/30 mt-1">
              {searchQuery
                ? "Try adjusting your search terms."
                : "No landlords in this category."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredLandlords.length > 0 && (
          <div className="px-6 py-4 border-t border-ink/5 flex items-center justify-between">
            <p className="text-sm text-ink/40">
              Showing {filteredLandlords.length} of {mockLandlords.length}{" "}
              landlords
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-ink/60 px-2">
                Page {currentPage}
              </span>
              <button className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLandlord && (
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
            <div className="p-6 space-y-6">
              {/* Profile Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedLandlord.firstName[0]}
                    {selectedLandlord.lastName[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl">
                    {selectedLandlord.firstName} {selectedLandlord.lastName}
                  </h4>
                  <p className="text-sm text-ink/60">
                    {selectedLandlord.businessName}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
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
                      {selectedLandlord.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-mist/50 sm:col-span-2">
                  <MapPin size={18} className="text-ink/40" />
                  <div>
                    <p className="text-xs text-ink/40">Address</p>
                    <p className="text-sm font-medium">
                      {selectedLandlord.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h5 className="text-sm font-semibold text-ink/60 mb-3">
                  Uploaded Documents
                </h5>
                <div className="space-y-2">
                  {selectedLandlord.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-mist/50"
                    >
                      <span className="text-sm font-medium">{doc}</span>
                      <button className="text-xs font-semibold text-bay hover:text-bay-deep transition-colors">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {selectedLandlord.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-ink/5">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApprove(selectedLandlord);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                  >
                    <Check size={18} />
                    Approve Landlord
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleReject(selectedLandlord);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                  >
                    <X size={18} />
                    Reject Landlord
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setShowApproveModal(false)}
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
                Are you sure you want to approve{" "}
                <span className="font-semibold text-ink">
                  {selectedLandlord.firstName} {selectedLandlord.lastName}
                </span>
                ? They will be able to list properties immediately.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              >
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
            onClick={() => setShowRejectModal(false)}
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
                Please provide a reason for rejecting{" "}
                <span className="font-semibold text-ink">
                  {selectedLandlord.firstName} {selectedLandlord.lastName}
                </span>
                . This will be shown to the landlord.
              </p>
            </div>
            <div className="mt-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete documents, invalid ID, business permit expired..."
                rows={3}
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-3 bg-mist/30 focus:bg-white focus:outline-none focus:border-red-300 text-sm resize-none transition-all"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
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
