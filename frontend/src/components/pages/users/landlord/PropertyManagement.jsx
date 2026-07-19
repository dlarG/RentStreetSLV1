/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MapPin,
  Building2,
  Loader2,
  Edit3,
  Trash2,
  DoorOpen,
  AlertTriangle,
} from "lucide-react";
import api from "../../../../lib/api";
import PropertyFormModal from "./PropertyFormModal";
import RoomsModal from "./RoomsModal";
import "../../../../lib/leafletIconFix";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");

const STATUS_STYLES = {
  active: "bg-green-50 text-green-600",
  inactive: "bg-ink/5 text-ink/50",
  pending_review: "bg-marigold/10 text-marigold",
  suspended: "bg-red-50 text-red-600",
};
const STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  pending_review: "Pending Review",
  suspended: "Suspended",
};

function PropertyManagement() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null); // null = create mode
  const [roomsFor, setRoomsFor] = useState(null); // property object or null
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    document.title = "RentStreet | My Properties";
  }, []);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    api
      .get("/landlord/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => {
        setErrorMsg(
          err.response?.data?.detail || "Couldn't load your properties."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
            My Properties
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            Manage your boarding houses and rooms.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProperty(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bay text-white text-sm font-semibold hover:bg-bay-deep transition-colors"
        >
          <Plus size={16} /> Add Property
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-bay" size={28} />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink/5 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-mist flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-ink/20" />
          </div>
          <p className="text-ink/40 font-medium">No properties yet</p>
          <p className="text-sm text-ink/30 mt-1 mb-5">
            Add your first boarding house to start listing rooms.
          </p>
          <button
            onClick={() => {
              setEditingProperty(null);
              setShowForm(true);
            }}
            className="btn-primary rounded-xl px-5 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add Property
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-ink/5 overflow-hidden hover:shadow-lg hover:shadow-ink/5 transition-all"
            >
              <div className="h-48 sm:h-52 bg-mist relative">
                {p.cover_image_url ? (
                  <img
                    src={`${API_ORIGIN}${p.cover_image_url}`}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 size={40} className="text-ink/15" />
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                    STATUS_STYLES[p.status]
                  }`}
                >
                  {STATUS_LABELS[p.status]}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-display font-bold text-xl leading-tight mb-4">
                  {p.name}
                </h3>
                <div className="flex items-start gap-2 text-base text-ink/60 mb-5">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <span>
                    {[p.address_line, p.barangay, p.municipality]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-base text-ink/50 mb-6">
                  <DoorOpen size={16} />
                  {p.room_count} {p.room_count === 1 ? "room" : "rooms"}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => p.status !== "suspended" && setRoomsFor(p)}
                    disabled={p.status === "suspended"}
                    className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      p.status === "suspended"
                        ? "bg-bay text-white cursor-not-allowed"
                        : "bg-bay hover:bg-bay-deep text-white"
                    }`}
                  >
                    <DoorOpen size={16} />
                    {p.status === "suspended" ? "Suspended" : "Rooms"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingProperty(p);
                      setShowForm(true);
                    }}
                    className="cursor-pointer w-11 h-11 rounded-xl bg-mist hover:bg-marigold/10 hover:text-marigold flex items-center justify-center transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="cursor-pointer w-11 h-11 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {p.status === "pending_review" && (
                <div className="bg-marigold/10 px-6 py-3 text-sm text-ink/60 border-t border-marigold/20">
                  Add your rooms now — this property will be reviewed together
                  before it goes live.
                </div>
              )}
              {p.status === "inactive" && p.rejection_reason && (
                <div className="bg-red-50 px-6 py-3 text-sm text-red-700 border-t border-red-200">
                  <span className="font-semibold">Needs changes:</span>{" "}
                  {p.rejection_reason}
                </div>
              )}
              {p.status === "suspended" && (
                <div className="bg-red-50 px-6 py-3 text-sm text-red-700 border-t border-red-200">
                  Suspended by our team. Contact support for details.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PropertyFormModal
          property={editingProperty}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchProperties();
          }}
        />
      )}

      {roomsFor && (
        <RoomsModal
          property={roomsFor}
          onClose={() => setRoomsFor(null)}
          onChanged={fetchProperties}
        />
      )}

      {deleteTarget && (
        <DeletePropertyModal
          property={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDone={() => {
            setDeleteTarget(null);
            fetchProperties();
          }}
        />
      )}
    </div>
  );
}

function DeletePropertyModal({ property, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/landlord/properties/${property.id}`);
      onDone();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't delete this property.");
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
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-600" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">
            Delete Property
          </h3>
          <p className="text-sm text-ink/60">
            Delete{" "}
            <span className="font-semibold text-ink">{property.name}</span> and
            all its rooms? This can't be undone.
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mt-4 text-left">
            {error}
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold hover:bg-mist transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyManagement;
