import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  Mail,
  Lock,
  Phone,
  User,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  ArrowRight,
  Check,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const PH_PHONE_REGEX = /^(09\d{9}|\+639\d{9})$/;

export default function RegisterPage() {
  const [role, setRole] = useState("renter");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    digit: /\d/.test(form.password),
    match:
      form.confirm_password.length > 0 &&
      form.password === form.confirm_password,
  };

  const validate = () => {
    const e = {};
    if (form.full_name.trim().length < 2)
      e.full_name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!PH_PHONE_REGEX.test(form.phone_number))
      e.phone_number = "e.g. 09171234567";
    if (!Object.values(passwordChecks).slice(0, 4).every(Boolean))
      e.password = "Password doesn't meet the requirements below.";
    if (!passwordChecks.match) e.confirm_password = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { message } = await register({ ...form, role });
      navigate("/login", { state: { successMessage: message } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setApiError(
        typeof detail === "string"
          ? detail
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center px-5 sm:px-8 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-9 h-9 flex items-center justify-center bg-bay rounded-full">
              <Building2 className="text-white" size={18} strokeWidth={2.5} />
            </span>
          </Link>
          <h1 className="font-display font-extrabold text-3xl mb-2">
            Create your account
          </h1>
          <p className="text-ink/60 text-sm">
            Find a room, or start listing yours.
          </p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("renter")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 transition-all ${
              role === "renter"
                ? "border-bay bg-bay/5"
                : "border-ink/10 hover:border-ink/20"
            }`}
          >
            <GraduationCap
              size={22}
              className={role === "renter" ? "text-bay" : "text-ink/40"}
            />
            <span className="font-semibold text-sm">I'm a Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("landlord")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 transition-all ${
              role === "landlord"
                ? "border-bay bg-bay/5"
                : "border-ink/10 hover:border-ink/20"
            }`}
          >
            <Building2
              size={22}
              className={role === "landlord" ? "text-bay" : "text-ink/40"}
            />
            <span className="font-semibold text-sm">I'm a Landlord</span>
          </button>
        </div>

        {role === "landlord" && (
          <div className="bg-marigold/10 border border-marigold/30 text-ink/70 text-sm rounded-2xl px-4 py-3 mb-6">
            Landlord accounts are reviewed by our team before you can list a
            property. This usually takes 1–2 business days.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            icon={User}
            label="Full name"
            value={form.full_name}
            onChange={update("full_name")}
            error={errors.full_name}
            placeholder="Juan Dela Cruz"
          />
          <Field
            icon={Mail}
            label="Email address"
            type="email"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
            placeholder="you@email.com"
          />
          <Field
            icon={Phone}
            label="Phone number"
            value={form.phone_number}
            onChange={update("phone_number")}
            error={errors.phone_number}
            placeholder="09171234567"
          />

          <div>
            <label className="text-sm font-semibold text-ink/70 block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                className="w-full rounded-2xl border-2 border-ink/10 pl-12 pr-12 py-3.5 bg-white focus:outline-none focus:border-bay transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <Requirement met={passwordChecks.length} label="8+ characters" />
              <Requirement met={passwordChecks.upper} label="One uppercase" />
              <Requirement met={passwordChecks.lower} label="One lowercase" />
              <Requirement met={passwordChecks.digit} label="One number" />
            </ul>
          </div>

          <Field
            icon={Lock}
            label="Confirm password"
            type={showPassword ? "text" : "password"}
            value={form.confirm_password}
            onChange={update("confirm_password")}
            error={errors.confirm_password}
          />

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-2xl py-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Create account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-papaya">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink/70 block mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
        />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-2xl border-2 pl-12 pr-4 py-3.5 bg-white focus:outline-none transition-all ${
            error
              ? "border-red-300 focus:border-red-400"
              : "border-ink/10 focus:border-bay"
          }`}
        />
      </div>
      {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function Requirement({ met, label }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${
        met ? "text-bay" : "text-ink/40"
      }`}
    >
      <Check size={12} className={met ? "opacity-100" : "opacity-30"} /> {label}
    </li>
  );
}
