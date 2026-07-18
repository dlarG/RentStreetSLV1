/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  X,
  Loader2,
  Plus,
  Edit3,
  Trash2,
  Bed,
  AlertTriangle,
} from "lucide-react";
import api from "../../../lib/api";

const ROOM_STATUS_STYLES = {
  available: "bg-green-50 text-green-600",
  full: "bg-marigold/10 text-marigold",
  maintenance: "bg-orange-50 text-orange-600",
  delisted: "bg-ink/5 text-ink/40",
};

export default function RoomsModal({ property, onClose, onChanged }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRooms = useCallback(() => {
    setLoading(true);
    api
      .get(`/landlord/properties/${property.id}`)
      .then((res) => setRooms(res.data.rooms))
      .catch(() => setErrorMsg("Couldn't load rooms."))
      .finally(() => setLoading(false));
  }, [property.id]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleChanged = () => {
    fetchRooms();
    onChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-ink/5 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h3 className="font-display font-bold text-xl">Rooms</h3>
            <p className="text-xs text-ink/50">{property.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => {
              setEditingRoom(null);
              setShowRoomForm(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bay text-white text-sm font-semibold hover:bg-bay-deep transition-colors w-full sm:w-auto"
          >
            <Plus size={16} /> Add Room
          </button>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="animate-spin text-bay" size={24} />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-10">
              <Bed size={28} className="text-ink/20 mx-auto mb-2" />
              <p className="text-sm text-ink/40">No rooms added yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {rooms.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl bg-mist/50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-ink">
                        {r.room_label}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ROOM_STATUS_STYLES[r.status]
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink/50 mt-0.5">
                      {r.room_type === "private" ? "Private" : "Shared"} ·
                      Capacity {r.capacity} · ₱
                      {r.base_price_monthly.toLocaleString()}/mo
                      {r.has_own_bathroom && " · Own CR"}
                      {r.has_aircon && " · Aircon"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingRoom(r);
                        setShowRoomForm(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-marigold/10 hover:text-marigold flex items-center justify-center transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showRoomForm && (
        <RoomFormModal
          propertyId={property.id}
          room={editingRoom}
          onClose={() => setShowRoomForm(false)}
          onSaved={() => {
            setShowRoomForm(false);
            handleChanged();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteRoomModal
          room={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDone={() => {
            setDeleteTarget(null);
            handleChanged();
          }}
        />
      )}
    </div>
  );
}

function RoomFormModal({ propertyId, room, onClose, onSaved }) {
  const isEdit = Boolean(room);
  const [form, setForm] = useState({
    room_label: room?.room_label || "",
    room_type: room?.room_type || "private",
    capacity: room?.capacity ?? 1,
    base_price_monthly: room?.base_price_monthly ?? "",
    has_own_bathroom: room?.has_own_bathroom ?? false,
    has_aircon: room?.has_aircon ?? false,
    floor_level: room?.floor_level ?? "",
    status: room?.status || "available",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        base_price_monthly: Number(form.base_price_monthly),
        floor_level: form.floor_level === "" ? null : Number(form.floor_level),
      };
      if (isEdit) {
        delete payload.room_type; // room_type isn't editable after creation
        await api.patch(`/landlord/rooms/${room.id}`, payload);
      } else {
        await api.post(`/landlord/properties/${propertyId}/rooms`, payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't save this room.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl">
        <div className="border-b border-ink/5 px-6 py-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">
            {isEdit ? "Edit Room" : "Add Room"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink/70 block mb-1.5">
              Room label
            </label>
            <input
              type="text"
              value={form.room_label}
              onChange={update("room_label")}
              required
              placeholder="Room 1"
              className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Room type
              </label>
              <select
                value={form.room_type}
                onChange={update("room_type")}
                disabled={isEdit}
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm disabled:opacity-50"
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={update("capacity")}
                required
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Monthly price (₱)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.base_price_monthly}
                onChange={update("base_price_monthly")}
                required
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Floor (optional)
              </label>
              <input
                type="number"
                value={form.floor_level}
                onChange={update("floor_level")}
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.has_own_bathroom}
                onChange={update("has_own_bathroom")}
                className="w-4 h-4 rounded border-ink/20 text-bay"
              />
              Own bathroom
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.has_aircon}
                onChange={update("has_aircon")}
                className="w-4 h-4 rounded border-ink/20 text-bay"
              />
              Air conditioning
            </label>
          </div>

          {isEdit && (
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={update("status")}
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
              >
                <option value="available">Available</option>
                <option value="full">Full</option>
                <option value="maintenance">Maintenance</option>
                <option value="delisted">Delisted</option>
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Room"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function DeleteRoomModal({ room, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/landlord/rooms/${room.id}`);
      onDone();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't delete this room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
        <h3 className="font-display font-bold text-lg mb-1">Delete Room</h3>
        <p className="text-sm text-ink/60">
          Delete{" "}
          <span className="font-semibold text-ink">{room.room_label}</span>?
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mt-3 text-left">
            {error}
          </div>
        )}
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-ink/10 text-ink/60 font-semibold text-sm hover:bg-mist transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
