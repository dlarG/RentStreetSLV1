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
  MapPin,
  Star,
  Check,
  ChevronRight,
  Building2,
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
  const [activeTab, setActiveTab] = useState("profile");

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
      setTimeout(() => setSaved(false), 3000);
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

  const tabs = [
    { value: "profile", label: "Profile", icon: User },
    { value: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
            Account Settings
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            Manage your profile and account preferences.
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-3">
          <Check size={16} className="flex-shrink-0" />
          Changes saved successfully.
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
        {/* Cover Area */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-bay to-bay-deep relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=`60` height=`60` viewBox=`0 0 60 60` xmlns=`http://www.w3.org/2000/svg`%3E%3Cg fill=`none` fill-rule=`evenodd`%3E%3Cg fill=`%23ffffff` fill-opacity=`0.05`%3E%3Cpath d=`M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z`/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                {profile?.profile_photo_url ? (
                  <img
                    src={fileUrl(profile.profile_photo_url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-bay to-marigold flex items-center justify-center">
                    <User size={36} className="text-white" />
                  </div>
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-white" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 w-8 h-8 rounded-lg bg-white shadow-md border border-ink/10 flex items-center justify-center cursor-pointer hover:bg-mist transition-colors opacity-0 group-hover:opacity-100">
                <Camera size={14} className="text-ink/60" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingPhoto}
                  onChange={(e) =>
                    handlePhotoChange(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            {/* Name & Role */}
            <div className="flex-1">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
                {profile?.full_name || "Your Name"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-bay/10 text-bay text-xs font-semibold">
                  {RENTER_TYPES.find((t) => t.value === form.renter_type)
                    ?.label || "Renter"}
                </span>
                {profile?.trust_score != null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                    <Star size={12} />
                    {profile.trust_score}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink/50 mt-2 flex items-center gap-1">
                <Mail size={14} />
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-mist/50 p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.value
                  ? "bg-white text-bay shadow-sm"
                  : "text-ink/40 hover:text-ink/60"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/5">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <User size={18} className="text-bay" />
                Basic Information
              </h3>
              <p className="text-xs text-ink/40 mt-0.5">
                Your personal details
              </p>
            </div>
            <div className="p-6 space-y-4">
              <TextField
                icon={User}
                label="Full name"
                value={form.full_name}
                onChange={update("full_name")}
                required
              />
              <div>
                <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                  Email address
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
                    className="w-full rounded-xl border-1 border-ink/5 pl-10 pr-4 py-3 bg-mist/30 text-ink/50 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-ink/30 mt-1">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>
              <TextField
                icon={Phone}
                label="Phone number"
                value={form.phone_number}
                onChange={update("phone_number")}
                placeholder="+63 917 123 4567"
                required
              />
            </div>
          </div>

          {/* Renter Type */}
          <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/5">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Building2 size={18} className="text-bay" />I am a...
              </h3>
              <p className="text-xs text-ink/40 mt-0.5">
                Help us personalize your experience
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RENTER_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, renter_type: value }))
                    }
                    className={`cursor-pointer flex flex-col items-center gap-2 rounded-xl border-1 p-4 transition-all text-center ${
                      form.renter_type === value
                        ? "border-bay bg-[#c5ae95] shadow-sm"
                        : "border-ink/10 hover:border-ink/20 hover:bg-mist/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        form.renter_type === value
                          ? "bg-[#c5ae95] text-white"
                          : "bg-mist text-ink/40"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="font-semibold text-xs">{label}</span>
                  </button>
                ))}
              </div>

              {form.renter_type === "student" && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2 bg-mist/30 rounded-xl p-4">
                  <TextField
                    label="Academic major"
                    value={form.academic_major}
                    onChange={update("academic_major")}
                    placeholder="e.g., BS Computer Science"
                  />
                  <TextField
                    label="Year level"
                    type="number"
                    value={form.year_level}
                    onChange={update("year_level")}
                    placeholder="1st, 2nd, etc."
                  />
                </div>
              )}
              {form.renter_type === "worker" && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2 bg-mist/30 rounded-xl p-4">
                  <TextField
                    label="Occupation"
                    value={form.occupation}
                    onChange={update("occupation")}
                    placeholder="e.g., Nurse, Teacher"
                  />
                  <TextField
                    label="Employer / Company"
                    value={form.employer_name}
                    onChange={update("employer_name")}
                    placeholder="Company or institution name"
                  />
                </div>
              )}
              {form.renter_type === "tourist" && (
                <div className="pt-2 bg-mist/30 rounded-xl p-4">
                  <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                    Expected length of stay
                  </label>
                  <select
                    value={form.stay_duration}
                    onChange={update("stay_duration")}
                    className="w-full rounded-xl border-1 border-ink/10 px-4 py-3 bg-white focus:outline-none focus:border-bay transition-all text-sm"
                  >
                    <option value="">Select duration...</option>
                    <option value="short_term">
                      Short term (days to weeks)
                    </option>
                    <option value="semester">A few months</option>
                    <option value="long_term">Long term stay</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/5">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <MapPin size={18} className="text-bay" />
                Budget Preferences
              </h3>
              <p className="text-xs text-ink/40 mt-0.5">
                Set your monthly rent budget range
              </p>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <TextField
                  label="Minimum budget (₱/month)"
                  type="number"
                  value={form.budget_min}
                  onChange={update("budget_min")}
                  placeholder="1500"
                  hint="Lowest rent you're willing to pay"
                />
                <TextField
                  label="Maximum budget (₱/month)"
                  type="number"
                  value={form.budget_max}
                  onChange={update("budget_max")}
                  placeholder="4000"
                  hint="Highest rent you can afford"
                />
              </div>
            </div>
          </div>

          {/* Verification ID */}
          <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/5">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <ShieldAlert size={18} className="text-bay" />
                Verification
              </h3>
              <p className="text-xs text-ink/40 mt-0.5">
                Your submitted identification document
              </p>
            </div>
            <div className="p-6">
              {profile?.valid_id_url ? (
                <a
                  href={fileUrl(profile.valid_id_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-mist/50 hover:bg-mist transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-bay/10 flex items-center justify-center">
                    <FileText size={22} className="text-bay" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Government ID uploaded
                    </p>
                    <p className="text-xs text-ink/40">
                      Click to view your submitted ID
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-ink/30 group-hover:text-bay transition-colors"
                  />
                </a>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-mist/30">
                  <div className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center">
                    <FileText size={22} className="text-ink/20" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink/60">
                      No ID on file
                    </p>
                    <p className="text-xs text-ink/40">
                      Contact support to upload your verification ID
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer btn-primary rounded-xl px-8 py-3 flex items-center justify-center gap-2 disabled:opacity-50 text-sm font-semibold"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/5">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Lock size={18} className="text-bay" />
                Change Password
              </h3>
            </div>
            <div className="p-6">
              <ChangePasswordSection />
            </div>
          </div>

          {/* Deactivate Account */}
          <DeactivateAccountSection
            onDeactivated={() => {
              logout();
              navigate("/login");
            }}
          />
        </div>
      )}
    </div>
  );
}

function ChangePasswordSection() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.patch("/renter/profile/password", {
        current_password: form.currentPassword,
        new_password: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Password updated successfully.</p>
      )}

      <PasswordField
        label="Current password"
        value={form.currentPassword}
        onChange={(v) => setForm((f) => ({ ...f, currentPassword: v }))}
        show={showCurrent}
        onToggle={() => setShowCurrent(!showCurrent)}
      />
      <PasswordField
        label="New password"
        value={form.newPassword}
        onChange={(v) => setForm((f) => ({ ...f, newPassword: v }))}
        show={showNew}
        onToggle={() => setShowNew(!showNew)}
        hint="8+ characters, upper & lowercase, and a number"
      />
      <PasswordField
        label="Confirm new password"
        value={form.confirmPassword}
        onChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))}
        show={showNew}
        onToggle={() => setShowNew(!showNew)}
      />

      <button
        type="submit"
        disabled={loading || !form.currentPassword || !form.newPassword}
        className="cursor-pointer btn-primary rounded-xl px-6 py-3 flex items-center gap-2 disabled:opacity-50 text-sm font-semibold"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Lock size={16} /> Update Password
          </>
        )}
      </button>
    </form>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, hint }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink/70 block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30"
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full rounded-xl border-1 border-ink/10 pl-10 pr-11 py-3 bg-white focus:outline-none focus:border-bay transition-all text-sm"
        />
        <button
          type="button"
          onClick={onToggle}
          className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <p className="text-xs text-ink/40 mt-1">{hint}</p>}
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
    <div className="bg-white rounded-2xl border-1 border-red-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-red-100 bg-red-50/50">
        <h3 className="font-display font-bold text-lg flex items-center gap-2 text-red-700">
          <ShieldAlert size={18} />
          Danger Zone
        </h3>
        <p className="text-xs text-red-600/70 mt-0.5">
          Irreversible account actions
        </p>
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">
              Deactivate your account
            </p>
            <p className="text-sm text-ink/60 mt-0.5">
              This deactivates your account and signs you out. Your data is
              preserved — contact support to reactivate.
            </p>
          </div>
        </div>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border-1 border-red-300 text-red-700 font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            <AlertTriangle size={16} /> Deactivate my account
          </button>
        ) : (
          <form
            onSubmit={handleDeactivate}
            className="space-y-3 bg-red-50/50 rounded-xl p-4"
          >
            <div>
              <label className="text-sm font-semibold text-red-700 block mb-1.5">
                Enter your password to confirm
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
                  className="w-full rounded-xl border-1 border-red-300 pl-10 pr-11 py-2.5 bg-white focus:outline-none focus:border-red-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-700 font-medium">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  setPassword("");
                  setError("");
                }}
                disabled={loading}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl border-1 border-red-200 text-red-700/70 font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!password || loading}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
  hint,
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
          className={`w-full rounded-xl border-1 border-ink/10 ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-3 bg-white focus:outline-none focus:border-bay transition-all text-sm`}
        />
      </div>
      {hint && <p className="text-xs text-ink/40 mt-1">{hint}</p>}
    </div>
  );
}

export default RenterSettings;
