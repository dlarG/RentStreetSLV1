import { useState, useEffect } from "react";
import {
  Star,
  Heart,
  MapPin,
  X,
  DoorOpen,
  Check,
  Loader2,
  Wifi,
  Droplet,
  Shield,
  Zap,
  Home,
  Wind,
  Camera,
  Lock,
  CookingPot,
  WashingMachine,
  GraduationCap,
  Briefcase,
  Moon,
  Car,
  PawPrint,
  ShowerHead,
  Fan,
  Table,
  Lightbulb,
  Sofa,
  ShoppingBag,
  Bus,
  Hospital,
  HeartIcon,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import api from "../../../../lib/api";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const AMENITY_ICON_MAP = {
  wifi: Wifi,
  tv: Home,
  zap: Zap,
  droplet: Droplet,
  droplets: Droplet,
  "shower-head": ShowerHead,
  bath: Home,
  wind: Wind,
  fan: Fan,
  table: Table,
  cabinet: Home,
  camera: Camera,
  shield: Shield,
  lock: Lock,
  flame: Home,
  lightbulb: Lightbulb,
  "cooking-pot": CookingPot,
  utensils: Home,
  "washing-machine": WashingMachine,
  sofa: Sofa,
  car: Car,
  "paw-print": PawPrint,
  moon: Moon,
  footprints: Home,
  bus: Bus,
  "shopping-bag": ShoppingBag,
  hospital: Hospital,
  heart: HeartIcon,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
};
const iconFor = (key) => AMENITY_ICON_MAP[key] || Home;

export function RatingBadge({ rating, count }) {
  if (!rating)
    return <span className="text-xs text-ink/30">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink">
      <Star size={13} className="text-marigold" fill="currentColor" /> {rating}{" "}
      <span className="text-ink/40 font-normal">({count})</span>
    </span>
  );
}

export function AmenityChips({ amenities }) {
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

export function PropertyCard({ property: p, onClick, onToggleFavorite }) {
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

export function PropertyListRow({ property: p, onClick, onToggleFavorite }) {
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

export function InfoTile({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-mist/50">
      <p className="text-xs text-ink/40 capitalize">{label}</p>
      <p className="font-medium text-ink capitalize">{value}</p>
    </div>
  );
}

export function PropertyDetailModal({
  propertyId,
  onClose,
  onFavoriteChange,
  onApplied,
}) {
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
      onApplied?.(propertyId);
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
                  .filter(
                    (r) =>
                      r.status === "available" ||
                      data.room_application_status[r.id]
                  )
                  .map((r) => {
                    const appliedStatus = data.room_application_status[r.id];
                    const isApplied = Boolean(appliedStatus);
                    return (
                      <button
                        key={r.id}
                        onClick={() => !isApplied && setSelectedRoomId(r.id)}
                        disabled={isApplied}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          isApplied
                            ? "border-ink/10 bg-mist/50 cursor-not-allowed opacity-70"
                            : selectedRoomId === r.id
                            ? "border-bay bg-bay/5"
                            : "border-ink/10 hover:border-ink/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold flex items-center gap-2">
                            {r.room_label}
                            {isApplied && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-marigold/20 text-marigold">
                                {appliedStatus === "accepted"
                                  ? "Renting"
                                  : "Applied"}
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-bold text-bay">
                            ₱{r.base_price_monthly.toLocaleString()}/mo
                          </span>
                        </div>
                        <p className="text-xs text-ink/50">
                          {r.room_type === "private" ? "Private" : "Shared"} ·
                          Capacity {r.capacity}
                          {r.has_own_bathroom && " · Own CR"}
                          {r.has_aircon && " · Aircon"}
                        </p>
                      </button>
                    );
                  })}
                {data.rooms.filter(
                  (r) =>
                    r.status === "available" ||
                    data.room_application_status[r.id]
                ).length === 0 && (
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
                disabled={
                  !selectedRoomId ||
                  applying ||
                  Boolean(data.room_application_status[selectedRoomId])
                }
                className="flex-1 btn-primary rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
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
