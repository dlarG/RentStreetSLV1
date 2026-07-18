import { useState, useEffect } from "react";
import { X, Loader2, MapPin, Camera, Image as ImageIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import api from "../../../../lib/api";

// Sogod, Southern Leyte — sensible default center for a new pin
const DEFAULT_CENTER = [10.3833, 124.9833];
const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");

function LocationPicker({ position, onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function PropertyFormModal({ property, onClose, onSaved }) {
  const isEdit = Boolean(property);
  const [amenities, setAmenities] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null); // existing image URL when editing

  const [form, setForm] = useState({
    name: "",
    description: "",
    address_line: "",
    barangay: "",
    curfew_time: "",
    allows_cooking: false,
    gender_policy: "mixed",
    water_supply_rating: "",
    is_sub_metered: true,
  });
  const [position, setPosition] = useState(null); // [lat, lng]
  const [selectedAmenities, setSelectedAmenities] = useState(new Set());

  useEffect(() => {
    api
      .get("/landlord/amenities")
      .then((res) => setAmenities(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/landlord/properties/${property.id}`)
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name,
          description: d.description || "",
          address_line: d.address_line || "",
          barangay: d.barangay || "",
          curfew_time: d.curfew_time || "",
          allows_cooking: d.allows_cooking,
          gender_policy: d.gender_policy,
          water_supply_rating: d.water_supply_rating ?? "",
          is_sub_metered: d.is_sub_metered,
        });
        setCoverPreviewUrl(d.cover_image_url || null);
        setPosition([d.latitude, d.longitude]);
        setSelectedAmenities(new Set(d.amenities.map((a) => a.id)));
      })
      .catch(() => setError("Couldn't load property details."))
      .finally(() => setLoadingDetail(false));
  }, [isEdit, property]);

  const update = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!position) {
      setError("Click on the map to set this property's location.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        address_line: form.address_line || null,
        barangay: form.barangay || null,
        latitude: position[0],
        longitude: position[1],
        curfew_time: form.curfew_time || null,
        allows_cooking: form.allows_cooking,
        gender_policy: form.gender_policy,
        water_supply_rating:
          form.water_supply_rating === ""
            ? null
            : Number(form.water_supply_rating),
        is_sub_metered: form.is_sub_metered,
        amenity_ids: Array.from(selectedAmenities),
      };

      let savedId;
      if (isEdit) {
        await api.patch(`/landlord/properties/${property.id}`, payload);
        savedId = property.id;
      } else {
        const res = await api.post("/landlord/properties", payload);
        savedId = res.data.id;
      }

      if (coverImage) {
        const imgData = new FormData();
        imgData.append("file", coverImage);
        await api.post(`/landlord/properties/${savedId}/cover-image`, imgData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't save this property.");
    } finally {
      setSaving(false);
    }
  };

  const amenitiesByCategory = amenities.reduce((acc, a) => {
    (acc[a.category] ||= []).push(a);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-ink/5 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h3 className="font-display font-bold text-xl">
            {isEdit ? "Edit Property" : "Add Property"}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {loadingDetail ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-bay" size={28} />
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-5">
            {!isEdit && (
              <div className="bg-marigold/10 border border-marigold/30 text-ink/70 text-sm rounded-2xl px-4 py-3">
                New properties are reviewed by our team before they appear in
                search results.
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Cover photo
              </label>
              <p className="text-xs text-ink/40 mb-2">
                This is the main photo renters see when browsing your property.
              </p>

              <label className="group relative block w-full h-48 rounded-2xl overflow-hidden cursor-pointer border-2 border-ink/10 hover:border-bay transition-colors bg-mist">
                {coverImage || coverPreviewUrl ? (
                  <>
                    <img
                      src={
                        coverImage
                          ? URL.createObjectURL(coverImage)
                          : `${API_ORIGIN}${coverPreviewUrl}`
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold flex items-center gap-2">
                        <Camera size={16} /> Change cover photo
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-ink/40">
                    <ImageIcon size={28} />
                    <span className="text-sm font-medium">
                      Add a cover photo
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <TextField
              label="Property name"
              value={form.name}
              onChange={update("name")}
              required
              placeholder="Dela Cruz Boarding House"
            />
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={update("description")}
                rows={3}
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm resize-none"
                placeholder="A quiet, secure boarding house 5 minutes from SLSU main gate..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                label="Street address"
                value={form.address_line}
                onChange={update("address_line")}
                placeholder="123 Rizal St."
              />
              <TextField
                label="Barangay"
                value={form.barangay}
                onChange={update("barangay")}
                placeholder="Poblacion"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Location{" "}
                <span className="text-ink/40 font-normal">
                  — click the map to place a pin
                </span>
              </label>
              <div className="rounded-2xl overflow-hidden border-2 border-ink/10 h-64">
                <MapContainer
                  center={position || DEFAULT_CENTER}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker position={position} onPick={setPosition} />
                </MapContainer>
              </div>
              {position ? (
                <p className="text-xs text-ink/40 mt-1.5 flex items-center gap-1">
                  <MapPin size={12} /> {position[0].toFixed(5)},{" "}
                  {position[1].toFixed(5)}
                </p>
              ) : (
                <p className="text-xs text-marigold mt-1.5">
                  No location set yet — click the map above.
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                  Curfew time (optional)
                </label>
                <input
                  type="time"
                  value={form.curfew_time}
                  onChange={update("curfew_time")}
                  className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                  Gender policy
                </label>
                <select
                  value={form.gender_policy}
                  onChange={update("gender_policy")}
                  className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
                >
                  <option value="mixed">Mixed</option>
                  <option value="male_only">Male only</option>
                  <option value="female_only">Female only</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                  Water supply rating (1–5, optional)
                </label>
                <select
                  value={form.water_supply_rating}
                  onChange={update("water_supply_rating")}
                  className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
                >
                  <option value="">Not rated</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end gap-2 pb-1.5">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.allows_cooking}
                    onChange={update("allows_cooking")}
                    className="w-4 h-4 rounded border-ink/20 text-bay"
                  />
                  Cooking allowed
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_sub_metered}
                    onChange={update("is_sub_metered")}
                    className="w-4 h-4 rounded border-ink/20 text-bay"
                  />
                  Utilities are sub-metered
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-2">
                Amenities
              </label>
              <div className="space-y-3">
                {Object.entries(amenitiesByCategory).map(([category, list]) => (
                  <div key={category}>
                    <p className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-1.5">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {list.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => toggleAmenity(a.id)}
                          className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                            selectedAmenities.has(a.id)
                              ? "border-ink bg-ink text-ink"
                              : "border-marigold text-white bg-papaya hover:border-papaya"
                          }`}
                        >
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {amenities.length === 0 && (
                  <p className="text-sm text-ink/40">
                    No amenities available yet.
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer btn-primary w-full rounded-xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Property"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, required = false, placeholder }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink/70 block mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
      />
    </div>
  );
}
