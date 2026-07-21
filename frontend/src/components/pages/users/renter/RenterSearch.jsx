/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  LayoutGrid,
  List,
  Star,
  Heart,
  MapPin,
  X,
  DoorOpen,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Droplet,
  Shield,
  Zap,
  Home,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import api from "../../../../lib/api";
import "../../../../lib/leafletIconFix";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const AMENITY_ICONS = {
  wifi: Wifi,
  droplet: Droplet,
  shield: Shield,
  zap: Zap,
};
const iconFor = (key) => AMENITY_ICONS[key] || Home;

const SORT_OPTIONS = [
  { value: "rating", label: "Highest rated" },
  { value: "price_low", label: "Price: low to high" },
  { value: "price_high", label: "Price: high to low" },
  { value: "newest", label: "Newest listed" },
];

function RenterSearch() {
  const [view, setView] = useState("grid"); // grid | list
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("rating");
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const pageSize = 12;

  useEffect(() => {
    document.title = "RentStreet | Find Rooms";
  }, []);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    api
      .get("/renter/properties/search", {
        params: { search: searchQuery, sort, page, page_size: pageSize },
      })
      .then((res) => {
        setProperties(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setErrorMsg("Couldn't load properties."))
      .finally(() => setLoading(false));
  }, [searchQuery, sort, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const toggleFavorite = async (property, e) => {
    e.stopPropagation();
    const willFavorite = !property.is_favorited;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === property.id ? { ...p, is_favorited: willFavorite } : p
      )
    );
    try {
      if (willFavorite) await api.post(`/renter/favorites/${property.id}`);
      else await api.delete(`/renter/favorites/${property.id}`);
    } catch {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, is_favorited: !willFavorite } : p
        )
      );
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          Find a room
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Browse verified boarding houses in Sogod.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search - full width on mobile */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or barangay..."
            className="w-full rounded-xl border border-ink/10 pl-10 pr-4 py-3 bg-white focus:outline-none focus:border-papaya transition-all text-sm"
          />
        </div>

        {/* Sort + View Toggle - side by side on mobile */}
        <div className="flex gap-2 sm:hidden">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 rounded-xl border border-ink/10 px-3 py-3 bg-white focus:outline-none focus:border-papaya transition-all text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="flex rounded-xl border border-ink/10 overflow-hidden flex-shrink-0">
            <button
              onClick={() => setView("grid")}
              className={`cursor-pointer px-3.5 py-3 flex items-center justify-center transition-colors ${
                view === "grid"
                  ? "bg-papaya text-white"
                  : "bg-white text-ink/40 hover:bg-mist"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`cursor-pointer px-3.5 py-3 flex items-center justify-center transition-colors ${
                view === "list"
                  ? "bg-papaya text-white"
                  : "bg-white text-ink/40 hover:bg-mist"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Sort + View Toggle - original layout on desktop */}
        <div className="hidden sm:flex gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-ink/10 px-3 py-3 bg-white focus:outline-none focus:border-papaya transition-all text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="flex rounded-xl border border-ink/10 overflow-hidden flex-shrink-0">
            <button
              onClick={() => setView("grid")}
              className={`cursor-pointer px-3.5 py-3 flex items-center justify-center transition-colors ${
                view === "grid"
                  ? "bg-papaya text-white"
                  : "bg-white text-ink/40 hover:bg-mist"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`cursor-pointer px-3.5 py-3 flex items-center justify-center transition-colors ${
                view === "list"
                  ? "bg-papaya text-white"
                  : "bg-white text-ink/40 hover:bg-mist"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-papaya" size={28} />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink/5 py-16 text-center">
          <Home size={28} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/40 font-medium">No properties found</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onClick={() => setSelectedId(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <PropertyListRow
              key={p.id}
              property={p}
              onClick={() => setSelectedId(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="flex items-center justify-between">
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

      {selectedId && (
        <PropertyDetailModal
          propertyId={selectedId}
          onClose={() => setSelectedId(null)}
          onFavoriteChange={fetchProperties}
        />
      )}
    </div>
  );
}

function RatingBadge({ rating, count }) {
  if (!rating)
    return <span className="text-xs text-ink/30">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink">
      <Star size={13} className="text-marigold" fill="currentColor" /> {rating}{" "}
      <span className="text-ink/40 font-normal">({count})</span>
    </span>
  );
}

function AmenityChips({ amenities }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {amenities.slice(0, 5).map((a) => {
        const Icon = iconFor(a.icon_key);
        return (
          <span
            key={a.id}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ink/60 bg-mist px-2 py-1 rounded-full"
          >
            <Icon size={11} /> {a.name}
          </span>
        );
      })}
    </div>
  );
}

function PropertyCard({ property: p, onClick, onToggleFavorite }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-ink/5 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-ink/5 transition-all group"
    >
      <div className="h-44 bg-mist relative">
        {p.cover_image_url ? (
          <img
            src={fileUrl(p.cover_image_url)}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={28} className="text-ink/15" />
          </div>
        )}
        <button
          onClick={(e) => onToggleFavorite(p, e)}
          className="cursor-pointer absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            size={16}
            className={p.is_favorited ? "text-papaya" : "text-ink/40"}
            fill={p.is_favorited ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="font-display font-bold text-base leading-tight truncate">
            {p.name}
          </h3>
          <p className="text-xs text-ink/40 flex items-center gap-1 mt-0.5">
            <MapPin size={11} />{" "}
            {[p.barangay, p.municipality].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-bay text-sm">
            {p.price_label}
            <span className="text-xs font-normal text-ink/40">/mo</span>
          </span>
          <RatingBadge rating={p.avg_rating} count={p.review_count} />
        </div>
        <p className="text-xs text-ink/40">
          {p.available_rooms_count} room
          {p.available_rooms_count !== 1 ? "s" : ""} available
        </p>
        <AmenityChips amenities={p.amenities} />
      </div>
    </div>
  );
}

function PropertyListRow({ property: p, onClick, onToggleFavorite }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-ink/5 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-ink/5 transition-all flex"
    >
      <div className="w-32 sm:w-44 h-full bg-mist flex-shrink-0 relative">
        {p.cover_image_url ? (
          <img
            src={fileUrl(p.cover_image_url)}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={22} className="text-ink/15" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-base truncate">
              {p.name}
            </h3>
            <p className="text-xs text-ink/40 flex items-center gap-1 mt-0.5">
              <MapPin size={11} />{" "}
              {[p.barangay, p.municipality].filter(Boolean).join(", ")}
            </p>
          </div>
          <button
            onClick={(e) => onToggleFavorite(p, e)}
            className="cursor-pointer w-9 h-9 rounded-full bg-mist flex items-center justify-center hover:bg-mist/70 transition-colors flex-shrink-0"
          >
            <Heart
              size={16}
              className={p.is_favorited ? "text-papaya" : "text-ink/40"}
              fill={p.is_favorited ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-papaya text-sm">
            {p.price_label}
            <span className="text-xs font-normal text-ink/40">/mo</span>
          </span>
          <RatingBadge rating={p.avg_rating} count={p.review_count} />
          <span className="text-xs text-ink/40">
            {p.available_rooms_count} room
            {p.available_rooms_count !== 1 ? "s" : ""}
          </span>
        </div>
        <AmenityChips amenities={p.amenities} />
      </div>
    </div>
  );
}

function PropertyDetailModal({ propertyId, onClose, onFavoriteChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    api
      .get(`/renter/properties/${propertyId}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Couldn't load this property."))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const toggleFavorite = async () => {
    if (!data) return;
    const willFavorite = !data.is_favorited;
    setData((d) => ({ ...d, is_favorited: willFavorite }));
    try {
      if (willFavorite) await api.post(`/renter/favorites/${propertyId}`);
      else await api.delete(`/renter/favorites/${propertyId}`);
      onFavoriteChange();
    } catch {
      setData((d) => ({ ...d, is_favorited: !willFavorite }));
    }
  };

  const submitApplication = async () => {
    if (!selectedRoomId) return;
    setApplying(true);
    setError("");
    try {
      await api.post("/renter/applications", {
        room_id: selectedRoomId,
        message: applyMessage || null,
      });
      setApplySuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Couldn't submit your application."
      );
    } finally {
      setApplying(false);
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
          <h3 className="font-display font-bold text-xl">Property Details</h3>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-papaya" size={28} />
          </div>
        ) : applySuccess ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-papaya/10 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-papaya" strokeWidth={3} />
            </div>
            <h4 className="font-display font-bold text-xl mb-2">
              Application submitted!
            </h4>
            <p className="text-sm text-ink/60 mb-6">
              The landlord will review your application and get back to you.
            </p>
            <button
              onClick={onClose}
              className="cursor-pointer btn-primary rounded-xl px-6 py-3"
            >
              Close
            </button>
          </div>
        ) : !data ? (
          <div className="p-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="relative h-56 rounded-2xl overflow-hidden bg-mist">
              {data.cover_image_url ? (
                <img
                  src={fileUrl(data.cover_image_url)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home size={32} className="text-ink/15" />
                </div>
              )}
              <button
                onClick={toggleFavorite}
                className="cursor-pointer absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              >
                <Heart
                  size={18}
                  className={data.is_favorited ? "text-papaya" : "text-ink/40"}
                  fill={data.is_favorited ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div>
              <div className="flex items-start justify-between gap-3 mb-1">
                <h4 className="font-display font-bold text-2xl">{data.name}</h4>
                <RatingBadge
                  rating={data.avg_rating}
                  count={data.review_count}
                />
              </div>
              <p className="text-sm text-ink/60 flex items-center gap-1">
                <MapPin size={13} />{" "}
                {[data.barangay, data.municipality].filter(Boolean).join(", ")}
              </p>
              {data.description && (
                <p className="text-sm text-ink/60 mt-3">{data.description}</p>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-ink/10 h-48">
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

            {data.all_amenities.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-ink/70 mb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.all_amenities.map((a) => {
                    const Icon = iconFor(a.icon_key);
                    return (
                      <span
                        key={a.id}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-papaya px-3 py-1.5 rounded-full"
                      >
                        <Icon size={13} /> {a.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-ink/70 mb-3 flex items-center gap-1.5">
                <DoorOpen size={15} /> Choose a room to apply for
              </p>
              <div className="space-y-2.5">
                {data.rooms
                  .filter((r) => r.status === "available")
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRoomId(r.id)}
                      className={`cursor-pointer w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedRoomId === r.id
                          ? "border-papaya bg-papaya/5"
                          : "border-ink/10 hover:border-ink/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">
                          {r.room_label}
                        </span>
                        <span className="text-sm font-bold text-papaya">
                          ₱{r.base_price_monthly.toLocaleString()}/mo
                        </span>
                      </div>
                      <p className="text-xs text-ink/50">
                        {r.room_type === "private" ? "Private" : "Shared"} ·
                        Capacity {r.capacity}
                        {r.has_own_bathroom && " · Own CR"}
                        {r.has_aircon && " · Aircon"}
                      </p>
                      {r.images.length > 0 && (
                        <div className="flex gap-1.5 mt-2 overflow-x-auto">
                          {r.images.slice(0, 4).map((img) => (
                            <img
                              key={img.id}
                              src={fileUrl(img.url)}
                              alt=""
                              className="w-40 h-40 rounded-lg object-cover flex-shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                {data.rooms.filter((r) => r.status === "available").length ===
                  0 && (
                  <p className="text-sm text-ink/40">
                    No rooms currently available at this property.
                  </p>
                )}
              </div>
            </div>

            {selectedRoomId && (
              <div>
                <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                  Message to the landlord (optional)
                </label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  rows={3}
                  placeholder="Introduce yourself, when you'd like to move in, etc."
                  className="w-full rounded-xl border-2 border-ink/10 px-4 py-3 bg-mist/30 focus:bg-white focus:outline-none focus:border-papaya text-sm resize-none"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-3 border-t border-ink/5 pt-5">
              <button
                onClick={onClose}
                className="cursor-pointer flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors"
              >
                Close
              </button>
              <button
                onClick={submitApplication}
                disabled={!selectedRoomId || applying}
                className="cursor-pointer flex-1 btn-primary rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {applying ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>
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

export default RenterSearch;
