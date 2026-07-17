/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Mail,
  Phone,
  UserPlus,
  Trash2,
  Edit3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  ShieldAlert,
  Lock,
  Save,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import api from "../../../lib/api";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

function TenantManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [renters, setRenters] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    document.title = "RentStreet Admin | Tenant Management";
  }, []);

  const fetchRenters = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    api
      .get("/admin/renters", {
        params: { search: searchQuery, page, page_size: pageSize },
      })
      .then((res) => {
        setRenters(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setErrorMsg("Couldn't load tenants. Try refreshing."))
      .finally(() => setLoading(false));
  }, [searchQuery, page]);

  useEffect(() => {
    fetchRenters();
  }, [fetchRenters]);
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const viewDetails = async (renter) => {
    setShowDetailsModal(true);
    setDetailData(null);
    try {
      const res = await api.get(`/admin/renters/${renter.id}`);
      setDetailData(res.data);
    } catch {
      setShowDetailsModal(false);
      setErrorMsg("Couldn't load tenant details.");
    }
  };

  const openEdit = async (renter) => {
    try {
      const res = await api.get(`/admin/renters/${renter.id}`);
      setSelected(res.data);
      setShowEditModal(true);
    } catch {
      setErrorMsg("Couldn't load tenant details.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
            Tenant Management
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            View, edit, and manage student / renter accounts.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bay text-white text-sm font-semibold hover:bg-bay-deep transition-colors"
        >
          <UserPlus size={16} /> Add Tenant
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

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
              placeholder="Search by name or email..."
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
                    Tenant
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/40 uppercase tracking-wider px-6 py-4">
                    Trust Score
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
                {renters.map((r) => (
                  <tr key={r.id} className="hover:bg-mist/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {r.profile_photo_url ? (
                          <img
                            src={fileUrl(r.profile_photo_url)}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">
                              {r.full_name?.[0] || "?"}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {r.full_name}
                          </p>
                          <p className="text-xs text-ink/40 truncate">
                            {r.email}
                          </p>
                        </div>
                        {r.other_accounts_same_ip > 0 && (
                          <span
                            title={`${r.other_accounts_same_ip} other account(s) share this registration IP`}
                          >
                            <ShieldAlert
                              size={15}
                              className="text-marigold flex-shrink-0"
                            />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          r.trust_score >= 80
                            ? "text-green-600"
                            : r.trust_score >= 50
                            ? "text-marigold"
                            : "text-red-600"
                        }`}
                      >
                        {r.trust_score != null ? r.trust_score.toFixed(0) : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.is_active ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-ink/40">
                        <Calendar size={14} />
                        {new Date(r.created_at).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(r)}
                          className="w-9 h-9 rounded-xl bg-mist/50 hover:bg-bay/10 hover:text-bay flex items-center justify-center transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(r)}
                          className="w-9 h-9 rounded-xl bg-mist/50 hover:bg-marigold/10 hover:text-marigold flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelected(r);
                            setShowDeleteModal(true);
                          }}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {renters.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-mist flex items-center justify-center mx-auto mb-4">
                  <GraduationCap size={28} className="text-ink/20" />
                </div>
                <p className="text-ink/40 font-medium">No tenants found</p>
              </div>
            )}
          </div>
        )}

        {total > 0 && (
          <div className="px-6 py-4 border-t border-ink/5 flex items-center justify-between">
            <p className="text-sm text-ink/40">
              Showing {renters.length} of {total} tenants
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

      {showAddModal && (
        <AddTenantModal
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            setShowAddModal(false);
            fetchRenters();
          }}
        />
      )}
      {showEditModal && selected && (
        <EditTenantModal
          renter={selected}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false);
            fetchRenters();
          }}
        />
      )}
      {showDetailsModal && (
        <DetailsModal
          data={detailData}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      {showDeleteModal && selected && (
        <DeleteModal
          renter={selected}
          onClose={() => setShowDeleteModal(false)}
          onDone={() => {
            setShowDeleteModal(false);
            fetchRenters();
          }}
        />
      )}
    </div>
  );
}

function ModalShell({ onClose, children, maxWidth = "max-w-md" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-3xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="sticky top-0 bg-white border-b border-ink/5 px-6 py-4 flex items-center justify-between rounded-t-3xl">
      <h3 className="font-display font-bold text-xl">{title}</h3>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-xl bg-mist hover:bg-ink/10 flex items-center justify-center transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function AddTenantModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/admin/renters", form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't create tenant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader title="Add Tenant" onClose={onClose} />
      <form onSubmit={submit} className="p-6 space-y-4">
        <p className="text-xs text-ink/50">
          Creates an account directly. The tenant can log in immediately; ID and
          profile photo can be added later.
        </p>
        <FormField
          label="Full name"
          value={form.full_name}
          onChange={(v) => setForm((f) => ({ ...f, full_name: v }))}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <FormField
          label="Phone number"
          value={form.phone_number}
          onChange={(v) => setForm((f) => ({ ...f, phone_number: v }))}
          placeholder="09171234567"
          required
        />
        <FormField
          label="Temporary password"
          type="password"
          value={form.password}
          onChange={(v) => setForm((f) => ({ ...f, password: v }))}
          required
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Create Tenant"
          )}
        </button>
      </form>
    </ModalShell>
  );
}

function EditTenantModal({ renter, onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: renter.full_name || "",
    email: renter.email || "",
    phone_number: renter.phone_number || "",
    academic_major: renter.academic_major || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.patch(`/admin/renters/${renter.id}`, form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't save changes.");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    setPasswordError("");
    setPasswordMsg("");
    setPasswordLoading(true);
    try {
      await api.patch(`/admin/renters/${renter.id}/password`, {
        new_password: newPassword,
      });
      setPasswordMsg("Password updated successfully.");
      setNewPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail || "Couldn't update password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader title="Edit Tenant" onClose={onClose} />
      <form onSubmit={saveProfile} className="p-6 space-y-4">
        <FormField
          label="Full name"
          value={form.full_name}
          onChange={(v) => setForm((f) => ({ ...f, full_name: v }))}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <FormField
          label="Phone number"
          value={form.phone_number}
          onChange={(v) => setForm((f) => ({ ...f, phone_number: v }))}
          required
        />
        <FormField
          label="Academic major (optional)"
          value={form.academic_major}
          onChange={(v) => setForm((f) => ({ ...f, academic_major: v }))}
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </form>

      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={() => setShowPasswordSection((s) => !s)}
          className="flex items-center gap-2 text-sm font-semibold text-bay hover:text-bay-deep transition-colors"
        >
          <Lock size={15} /> {showPasswordSection ? "Hide" : "Change"} password
        </button>

        {showPasswordSection && (
          <div className="mt-3 space-y-3 bg-mist/50 rounded-2xl p-4">
            <FormField
              label="New password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              hint="8+ chars, upper, lower, and a number."
            />
            {passwordError && (
              <p className="text-red-600 text-xs">{passwordError}</p>
            )}
            {passwordMsg && (
              <p className="text-green-600 text-xs">{passwordMsg}</p>
            )}
            <button
              type="button"
              onClick={savePassword}
              disabled={!newPassword || passwordLoading}
              className="w-full rounded-xl border-2 border-bay text-bay font-semibold py-2.5 text-sm hover:bg-bay hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {passwordLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function DetailsModal({ data, onClose }) {
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-lg">
      <ModalHeader title="Tenant Details" onClose={onClose} />
      {!data ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-bay" size={28} />
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            {data.profile_photo_url ? (
              <img
                src={fileUrl(data.profile_photo_url)}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {data.full_name?.[0]}
                </span>
              </div>
            )}
            <div>
              <h4 className="font-display font-bold text-xl">
                {data.full_name}
              </h4>
              <p className="text-sm text-ink/60">
                Trust score:{" "}
                <span className="font-semibold">
                  {data.trust_score?.toFixed(0) ?? "—"}
                </span>
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-mist/50">
              <Mail size={18} className="text-ink/40" />
              <div>
                <p className="text-xs text-ink/40">Email</p>
                <p className="text-sm font-medium">{data.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-mist/50">
              <Phone size={18} className="text-ink/40" />
              <div>
                <p className="text-xs text-ink/40">Phone</p>
                <p className="text-sm font-medium">
                  {data.phone_number || "—"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-ink/60 mb-3">
              Uploaded ID
            </h5>
            <div className="flex items-center justify-between p-3 rounded-xl bg-mist/50">
              <span className="text-sm font-medium">Student ID / Valid ID</span>
              {data.valid_id_url ? (
                <a
                  href={fileUrl(data.valid_id_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-bay hover:text-bay-deep"
                >
                  View
                </a>
              ) : (
                <span className="text-xs text-ink/30">Not uploaded</span>
              )}
            </div>
          </div>

          {data.other_accounts_same_ip > 0 && (
            <div className="bg-marigold/10 border border-marigold/30 rounded-xl px-4 py-3 flex items-start gap-2">
              <ShieldAlert
                size={16}
                className="text-marigold flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-ink/70">
                {data.other_accounts_same_ip} other account(s) registered from
                the same IP. Not proof of duplication — review manually.
              </p>
            </div>
          )}
        </div>
      )}
    </ModalShell>
  );
}

function DeleteModal({ renter, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsDeactivate, setNeedsDeactivate] = useState(false);

  const tryDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/admin/renters/${renter.id}`);
      onDone();
    } catch (err) {
      if (err.response?.status === 409) {
        setNeedsDeactivate(true);
        setError(err.response.data.detail);
      } else {
        setError(err.response?.data?.detail || "Couldn't delete this account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async () => {
    setLoading(true);
    setError("");
    try {
      await api.patch(`/admin/renters/${renter.id}/status`, null, {
        params: { is_active: false },
      });
      onDone();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Couldn't deactivate this account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-600" />
        </div>
        <h3 className="font-display font-bold text-xl mb-2">Delete Tenant</h3>
        <p className="text-sm text-ink/60">
          Delete{" "}
          <span className="font-semibold text-ink">{renter.full_name}</span>?
          This can't be undone.
        </p>

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
          {needsDeactivate ? (
            <button
              onClick={deactivate}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-marigold text-ink font-semibold hover:bg-marigold/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Deactivate Instead"
              )}
            </button>
          ) : (
            <button
              onClick={tryDelete}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Confirm Delete"
              )}
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  hint,
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink/70 block mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
      />
      {hint && <p className="text-xs text-ink/40 mt-1">{hint}</p>}
    </div>
  );
}

export default TenantManagement;
