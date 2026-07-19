/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Building2,
  Loader2,
  MapPin,
  Check,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  ShieldAlert,
  Bed,
  DoorOpen,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import api from "../../../lib/api";
import "../../../lib/leafletIconFix";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const TABS = [
  { label: "Pending Review", value: "pending_review" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const STATUS_STYLES = {
  active: "bg-green-50 text-green-600",
  inactive: "bg-ink/5 text-ink/50",
  pending_review: "bg-marigold/10 text-marigold",
  suspended: "bg-red-50 text-red-600",
};

function AdminPropertyManagement() {
  const [activeTab, setActiveTab] = useState("pending_review");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [detailId, setDetailId] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    document.title = "RentStreet Admin | Property Management";
  }, []);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    api
      .get("/admin/properties", {
        params: {
          status: activeTab,
          search: searchQuery,
          page,
          page_size: pageSize,
        },
      })
      .then((res) => {
        setProperties(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setErrorMsg("Couldn't load properties."))
      .finally(() => setLoading(false));
  }, [activeTab, searchQuery, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          Property Management
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Review and manage boarding house listings.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-left ${
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
              placeholder="Search by property or landlord name..."
              className="w-full rounded-xl border-2 border-ink/5 pl-10 pr-4 py-2.5 bg-mist/30 focus:bg-white focus:outline-none focus:border-bay/30 text-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="animate-spin text-bay" size={28} />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <Building2 size={28} className="text-ink/20 mx-auto mb-3" />
            <p className="text-ink/40 font-medium">No properties found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/5">
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Property
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Landlord
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Submitted
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-mist/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.cover_image_url ? (
                          <img
                            src={fileUrl(p.cover_image_url)}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-mist flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} className="text-ink/20" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-ink/40 truncate">
                            {p.room_count} rooms ·{" "}
                            {[p.barangay, p.municipality]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-ink">
                        {p.landlord_name}
                      </p>
                      <p className="text-xs text-ink/40">{p.landlord_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          STATUS_STYLES[p.status]
                        }`}
                      >
                        {TABS.find((t) => t.value === p.status)?.label ||
                          p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-ink/40">
                        <Calendar size={14} />
                        {new Date(p.created_at).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setDetailId(p.id)}
                          className="cursor-pointer w-9 h-9 rounded-xl bg-mist/50 hover:bg-bay/10 hover:text-bay flex items-center justify-center transition-colors"
                          title="Review"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="px-6 py-4 border-t border-ink/5 flex items-center justify-between">
            <p className="text-sm text-ink/40">
              Showing {properties.length} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="cursor-pointer w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-ink/60 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-mist disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {detailId && (
        <PropertyDetailModal
          propertyId={detailId}
          onClose={() => setDetailId(null)}
          onDecided={() => {
            setDetailId(null);
            fetchProperties();
          }}
        />
      )}
    </div>
  );
}

function PropertyDetailModal({ propertyId, onClose, onDecided }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const suspend = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/properties/${propertyId}/suspend`, {
        reason: suspendReason,
      });
      onDecided();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't suspend this property.");
    } finally {
      setActionLoading(false);
    }
  };
  useEffect(() => {
    api
      .get(`/admin/properties/${propertyId}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Couldn't load property details."))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const approve = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/properties/${propertyId}/approve`);
      onDecided();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't approve this property.");
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/properties/${propertyId}/reject`, {
        reason: rejectReason,
      });
      onDecided();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't reject this property.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-ink/5 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h3 className="font-display font-bold text-xl">Property Review</h3>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-bay" size={28} />
          </div>
        ) : !data ? (
          <div className="p-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {data.cover_image_url && (
              <img
                src={fileUrl(data.cover_image_url)}
                alt=""
                className="w-full h-56 rounded-2xl object-cover"
              />
            )}

            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display font-bold text-2xl">{data.name}</h4>
                <span
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
                    STATUS_STYLES[data.status]
                  }`}
                >
                  {data.status.replace("_", " ")}
                </span>
              </div>
              {data.description && (
                <p className="text-sm text-ink/60">{data.description}</p>
              )}
            </div>

            {/* Leaflet map — read-only marker showing the pinned location */}
            <div>
              <p className="text-sm font-semibold text-ink/70 mb-2 flex items-center gap-1.5">
                <MapPin size={15} /> Location
              </p>
              <div className="rounded-2xl overflow-hidden border-2 border-ink/10 h-56">
                <MapContainer
                  center={[data.latitude, data.longitude]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[data.latitude, data.longitude]} />
                </MapContainer>
              </div>
              <p className="text-xs text-ink/40 mt-1.5">
                {[
                  data.address_line,
                  data.barangay,
                  data.municipality,
                  data.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-mist/50 flex items-center gap-3">
                <User size={16} className="text-ink/40" />
                <div>
                  <p className="text-xs text-ink/40">Landlord</p>
                  <p className="text-sm font-medium">{data.landlord_name}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-mist/50 flex items-center gap-3">
                <Mail size={16} className="text-ink/40" />
                <div>
                  <p className="text-xs text-ink/40">Email</p>
                  <p className="text-sm font-medium">{data.landlord_email}</p>
                </div>
              </div>
              {data.landlord_phone && (
                <div className="p-4 rounded-xl bg-mist/50 flex items-center gap-3 sm:col-span-2">
                  <Phone size={16} className="text-ink/40" />
                  <div>
                    <p className="text-xs text-ink/40">Phone</p>
                    <p className="text-sm font-medium">{data.landlord_phone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <InfoTile
                label="Gender policy"
                value={data.gender_policy.replace("_", " ")}
              />
              <InfoTile label="Curfew" value={data.curfew_time || "None"} />
              <InfoTile
                label="Cooking"
                value={data.allows_cooking ? "Allowed" : "Not allowed"}
              />
              <InfoTile
                label="Water rating"
                value={
                  data.water_supply_rating
                    ? `${data.water_supply_rating}/5`
                    : "Not rated"
                }
              />
            </div>

            {data.amenities.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-ink/70 mb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.amenities.map((a) => (
                    <span
                      key={a.id}
                      className="px-3 py-1 rounded-full bg-bay/5 text-bay text-xs font-medium"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-ink/70 mb-3 flex items-center gap-1.5">
                <DoorOpen size={15} /> Rooms ({data.rooms.length})
              </p>
              {data.rooms.length === 0 ? (
                <p className="text-sm text-ink/40">No rooms added yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.rooms.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-mist/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          <Bed size={14} /> {r.room_label}
                        </p>
                        <span className="text-xs font-bold text-bay">
                          ₱{r.base_price_monthly.toLocaleString()}/mo
                        </span>
                      </div>
                      <p className="text-xs text-ink/50 mb-2">
                        {r.room_type === "private" ? "Private" : "Shared"} ·
                        Capacity {r.capacity}
                        {r.has_own_bathroom && " · Own CR"}
                        {r.has_aircon && " · Aircon"}
                      </p>
                      {r.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {r.images.map((img) => (
                            <img
                              key={img.id}
                              src={fileUrl(img.url)}
                              alt=""
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {data.status !== "suspended" && (
              <div className="border-t border-ink/5 pt-5">
                {!showRejectForm && !showSuspendForm ? (
                  <div className="flex flex-wrap gap-3">
                    {(data.status === "pending_review" ||
                      data.status === "inactive") && (
                      <button
                        onClick={approve}
                        disabled={actionLoading}
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}{" "}
                        Approve
                      </button>
                    )}
                    {data.status === "pending_review" && (
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                      >
                        <X size={16} /> Reject
                      </button>
                    )}
                    {data.status === "active" && (
                      <button
                        onClick={() => setShowSuspendForm(true)}
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
                      >
                        <ShieldAlert size={16} /> Suspend
                      </button>
                    )}
                  </div>
                ) : showRejectForm ? (
                  <div className="space-y-3">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      placeholder="e.g., Location pin doesn't match the address, photos unclear..."
                      className="w-full rounded-xl border-2 border-ink/10 px-4 py-3 bg-mist/30 focus:bg-white focus:outline-none focus:border-red-300 text-sm resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRejectForm(false)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={reject}
                        disabled={!rejectReason.trim() || actionLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading && (
                          <Loader2 size={16} className="animate-spin" />
                        )}{" "}
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      rows={3}
                      placeholder="e.g., Received a complaint about this listing..."
                      className="w-full rounded-xl border-2 border-ink/10 px-4 py-3 bg-mist/30 focus:bg-white focus:outline-none focus:border-orange-300 text-sm resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowSuspendForm(false)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={suspend}
                        disabled={!suspendReason.trim() || actionLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {actionLoading && (
                          <Loader2 size={16} className="animate-spin" />
                        )}{" "}
                        Confirm Suspension
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {data.status === "inactive" && data.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-red-700 mb-1">
                  Rejection reason given
                </p>
                <p className="text-sm text-red-700">{data.rejection_reason}</p>
              </div>
            )}
            {data.status === "suspended" && data.suspension_reason && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-orange-700 mb-1">
                  Suspension reason
                </p>
                <p className="text-sm text-orange-700">
                  {data.suspension_reason}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-mist/50">
      <p className="text-xs text-ink/40 capitalize">{label}</p>
      <p className="font-medium text-ink capitalize">{value}</p>
    </div>
  );
}

export default AdminPropertyManagement;
