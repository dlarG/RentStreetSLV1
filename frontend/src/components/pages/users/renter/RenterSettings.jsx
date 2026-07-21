/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Camera,
  GraduationCap,
  Briefcase,
  Plane,
  MoreHorizontal,
  Loader2,
  Save,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  FileText,
} from "lucide-react";
import api from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const RENTER_TYPES = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "worker", label: "Working professional", icon: Briefcase },
  { value: "tourist", label: "Tourist / short stay", icon: Plane },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

function RenterSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    renter_type: "student",
    campus_id: "",
    academic_major: "",
    year_level: "",
    occupation: "",
    employer_name: "",
    stay_duration: "",
    budget_min: "",
    budget_max: "",
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "RentStreet | Account Settings";
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    api
      .get("/renter/profile")
      .then((res) => {
        const d = res.data;
        setProfile(d);
        setForm({
          full_name: d.full_name || "",
          phone_number: d.phone_number || "",
          renter_type: d.renter_type || "student",
          campus_id: d.campus_id ?? "",
          academic_major: d.academic_major || "",
          year_level: d.year_level ?? "",
          occupation: d.occupation || "",
          employer_name: d.employer_name || "",
          stay_duration: d.stay_duration || "",
          budget_min: d.budget_min ?? "",
          budget_max: d.budget_max ?? "",
        });
      })
      .catch(() => setError("Couldn't load your profile."))
      .finally(() => setLoading(false));
  };

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const handlePhotoChange = async (file) => {
    if (!file) return;
    setUploadingPhoto(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/renter/profile/photo", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't update your photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload = {
        full_name: form.full_name,
        phone_number: form.phone_number,
        renter_type: form.renter_type,
        campus_id: form.campus_id === "" ? null : Number(form.campus_id),
        academic_major: form.academic_major || null,
        year_level: form.year_level === "" ? null : Number(form.year_level),
        occupation: form.occupation || null,
        employer_name: form.employer_name || null,
        stay_duration: form.stay_duration || null,
        budget_min: form.budget_min === "" ? null : Number(form.budget_min),
        budget_max: form.budget_max === "" ? null : Number(form.budget_max),
      };
      const res = await api.patch("/renter/profile", payload);
      setProfile(res.data);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-bay" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          Account Settings
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Manage your profile and account.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          Changes saved.
        </div>
      )}

      {/* Profile photo */}
      <div className="bg-white rounded-2xl border border-ink/5 p-6">
        <h3 className="font-display font-bold text-lg mb-4">Profile photo</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            {profile?.profile_photo_url ? (
              <img
                src={fileUrl(profile.profile_photo_url)}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center">
                <User size={28} className="text-white" />
              </div>
            )}
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-ink/50 rounded-2xl flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-white" />
              </div>
            )}
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-ink/10 text-sm font-semibold hover:bg-mist transition-colors">
            <Camera size={16} /> Change photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingPhoto}
              onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      {/* Uploaded ID — view only */}
      <div className="bg-white rounded-2xl border border-ink/5 p-6">
        <h3 className="font-display font-bold text-lg mb-1">Verification ID</h3>
        <p className="text-xs text-ink/40 mb-4">
          Submitted at registration. This can't be changed here — contact
          support if you need to update it.
        </p>
        {profile?.valid_id_url ? (
          <a
            href={fileUrl(profile.valid_id_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-mist/50 hover:bg-mist transition-colors w-fit"
          >
            <FileText size={18} className="text-bay" />
            <span className="text-sm font-medium text-bay">
              View uploaded ID
            </span>
          </a>
        ) : (
          <p className="text-sm text-ink/40">No ID on file.</p>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-ink/5 p-6 space-y-4">
          <h3 className="font-display font-bold text-lg">Basic information</h3>
          <TextField
            icon={User}
            label="Full name"
            value={form.full_name}
            onChange={update("full_name")}
            required
          />
          <div>
            <label className="text-sm font-semibold text-ink/70 block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30"
              />
              <input
                type="text"
                value={profile?.email || ""}
                disabled
                className="w-full rounded-xl border-2 border-ink/10 pl-10 pr-4 py-2.5 bg-mist/40 text-ink/50 text-sm cursor-not-allowed"
              />
            </div>
          </div>
          <TextField
            icon={Phone}
            label="Phone number"
            value={form.phone_number}
            onChange={update("phone_number")}
            placeholder="09171234567"
            required
          />
        </div>

        {/* Renter type */}
        <div className="bg-white rounded-2xl border border-ink/5 p-6 space-y-4">
          <h3 className="font-display font-bold text-lg">
            Which best describes you?
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {RENTER_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, renter_type: value }))}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 transition-all text-center ${
                  form.renter_type === value
                    ? "border-bay bg-bay/5"
                    : "border-ink/10 hover:border-ink/20"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    form.renter_type === value ? "text-bay" : "text-ink/40"
                  }
                />
                <span className="font-semibold text-xs">{label}</span>
              </button>
            ))}
          </div>

          {form.renter_type === "student" && (
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <TextField
                label="Academic major"
                value={form.academic_major}
                onChange={update("academic_major")}
                placeholder="BS Computer Science"
              />
              <TextField
                label="Year level"
                type="number"
                value={form.year_level}
                onChange={update("year_level")}
                placeholder="1"
              />
            </div>
          )}
          {form.renter_type === "worker" && (
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <TextField
                label="Occupation"
                value={form.occupation}
                onChange={update("occupation")}
                placeholder="Nurse, Teacher, etc."
              />
              <TextField
                label="Employer"
                value={form.employer_name}
                onChange={update("employer_name")}
                placeholder="Company or institution"
              />
            </div>
          )}
          {form.renter_type === "tourist" && (
            <div className="pt-2">
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Expected stay length
              </label>
              <select
                value={form.stay_duration}
                onChange={update("stay_duration")}
                className="w-full rounded-xl border-2 border-ink/10 px-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm"
              >
                <option value="">Select...</option>
                <option value="short_term">Short term (days to weeks)</option>
                <option value="semester">A few months</option>
                <option value="long_term">Long term</option>
              </select>
            </div>
          )}
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl border border-ink/5 p-6 space-y-4">
          <h3 className="font-display font-bold text-lg">Budget range</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Minimum (₱/mo)"
              type="number"
              value={form.budget_min}
              onChange={update("budget_min")}
              placeholder="1500"
            />
            <TextField
              label="Maximum (₱/mo)"
              type="number"
              value={form.budget_max}
              onChange={update("budget_max")}
              placeholder="4000"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary rounded-xl px-6 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </form>

      <DeactivateAccountSection
        onDeactivated={() => {
          logout();
          navigate("/login");
        }}
      />
    </div>
  );
}

function DeactivateAccountSection({ onDeactivated }) {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeactivate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/renter/account/deactivate", { password });
      onDeactivated();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Couldn't deactivate your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mt-10">
      <div className="flex items-start gap-3 mb-4">
        <ShieldAlert size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-display font-bold text-lg text-red-700">
            Deactivate account
          </h3>
          <p className="text-sm text-red-700/80 mt-1">
            This deactivates your account and signs you out. Your data isn't
            deleted — contact support if you'd like to reactivate later.
          </p>
        </div>
      </div>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-300 text-red-700 font-semibold text-sm hover:bg-red-100 transition-colors"
        >
          <AlertTriangle size={16} /> Deactivate my account
        </button>
      ) : (
        <form onSubmit={handleDeactivate} className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-red-700 block mb-1.5">
              Confirm your password to continue
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full rounded-xl border-2 border-red-300 pl-10 pr-11 py-2.5 bg-white focus:outline-none focus:border-red-500 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-700 font-medium">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setPassword("");
                setError("");
              }}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-700/70 font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!password || loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Confirm Deactivation"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function TextField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink/70 block mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border-2 border-ink/10 ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 bg-white focus:outline-none focus:border-bay transition-all text-sm`}
        />
      </div>
    </div>
  );
}

export default RenterSettings;
