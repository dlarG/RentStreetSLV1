import { useState, useEffect } from "react";
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
  ArrowLeft,
  Check,
  Clock,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const PH_PHONE_REGEX = /^(09\d{9}|\+639\d{9})$/;
const MAX_FILE_MB = 5;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("renter");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    business_name: "",
  });
  const [files, setFiles] = useState({
    profile_photo: null,
    valid_id: null,
    business_permit: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isLandlord = role === "landlord";
  const STEPS = isLandlord
    ? ["Role", "About you", "Security", "Documents"]
    : ["Role", "About you", "Security", "Photo"];

  useEffect(() => {
    document.title = "RentStreet | Find a room, or start listing yours.";
  }, []);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setFile = (field) => (file) => {
    setFiles((f) => ({ ...f, [field]: file }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    digit: /\d/.test(form.password),
    match:
      form.confirm_password.length > 0 &&
      form.password === form.confirm_password,
  };

  const validateFile = (file, label) => {
    if (!file) return `${label} is required.`;
    const okType = ["image/jpeg", "image/png", "application/pdf"].includes(
      file.type
    );
    if (!okType) return `${label} must be a JPG, PNG, or PDF.`;
    if (file.size > MAX_FILE_MB * 1024 * 1024)
      return `${label} must be under ${MAX_FILE_MB}MB.`;
    return null;
  };

  // Each step validates only its own fields — lets us gate "Next" without
  // punishing the person for fields they haven't reached yet.
  const validateStep = (targetStep) => {
    const e = {};
    if (targetStep === 2) {
      if (form.full_name.trim().length < 2)
        e.full_name = "Please enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        e.email = "Enter a valid email address.";
    }
    if (targetStep === 3) {
      if (!PH_PHONE_REGEX.test(form.phone_number))
        e.phone_number = "e.g. 09171234567";
      if (!Object.values(passwordChecks).slice(0, 4).every(Boolean))
        e.password = "Password doesn't meet the requirements below.";
      if (!passwordChecks.match) e.confirm_password = "Passwords do not match.";
    }
    if (targetStep === 4) {
      const photoErr = validateFile(files.profile_photo, "Profile photo");
      if (photoErr) e.profile_photo = photoErr;
      if (isLandlord) {
        if (!form.business_name.trim())
          e.business_name = "Business or establishment name is required.";
        const idErr = validateFile(files.valid_id, "Valid ID");
        if (idErr) e.valid_id = idErr;
        const permitErr = validateFile(
          files.business_permit,
          "Business permit"
        );
        if (permitErr) e.business_permit = permitErr;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  };
  const goBack = () => {
    setApiError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("full_name", form.full_name);
      data.append("email", form.email);
      data.append("phone_number", form.phone_number);
      data.append("password", form.password);
      data.append("confirm_password", form.confirm_password);
      data.append("role", role);
      data.append("profile_photo", files.profile_photo);

      if (isLandlord) {
        data.append("business_name", form.business_name);
        data.append("valid_id", files.valid_id);
        data.append("business_permit", files.business_permit);
      }

      await register(data);
      setShowSuccess(true);
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
            <span className="w-14 h-14 flex items-center justify-center bg-bay rounded-full overflow-hidden">
              <img
                src="/asset/logo/5-circled-modified.png"
                alt="RentStreet"
                className="w-full h-full object-cover"
              />
            </span>
          </Link>
          <h1 className="font-display font-extrabold text-3xl mb-2">
            Create your account
          </h1>
          <p className="text-ink/60 text-sm">
            Find a room, or start listing yours.
          </p>
        </div>

        <ProgressBar step={step} labels={STEPS} />

        <form onSubmit={handleSubmit} noValidate>
          {step === 1 && (
            <fieldset className="space-y-4">
              <legend className="sr-only">Choose your role</legend>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard
                  active={role === "renter"}
                  onClick={() => setRole("renter")}
                  icon={GraduationCap}
                  label="I'm a Student / Renter"
                  sub="Find a room near campus"
                />
                <RoleCard
                  active={role === "landlord"}
                  onClick={() => setRole("landlord")}
                  icon={Building2}
                  label="I'm a Landlord"
                  sub="List your property"
                />
              </div>
              {isLandlord && (
                <div className="bg-marigold/10 border border-marigold/30 text-ink/70 text-sm rounded-2xl px-4 py-3">
                  Landlord accounts are reviewed by our team — you'll be asked
                  to upload a valid ID and business permit so we can confirm
                  your boarding house is legitimate. Review usually takes 1–2
                  business days.
                </div>
              )}
              <NavButtons onNext={goNext} showBack={false} />
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-4">
              <legend className="sr-only">About you</legend>
              <Field
                icon={User}
                label="Full name"
                value={form.full_name}
                onChange={update("full_name")}
                error={errors.full_name}
                placeholder="Juan Dela Cruz"
                autoFocus
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
              <NavButtons onNext={goNext} onBack={goBack} />
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-4">
              <legend className="sr-only">Security</legend>
              <Field
                icon={Phone}
                label="Phone number"
                value={form.phone_number}
                onChange={update("phone_number")}
                error={errors.phone_number}
                placeholder="09171234567"
                autoFocus
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
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-ink/30"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <Requirement
                    met={passwordChecks.length}
                    label="8+ characters"
                  />
                  <Requirement
                    met={passwordChecks.upper}
                    label="One uppercase"
                  />
                  <Requirement
                    met={passwordChecks.lower}
                    label="One lowercase"
                  />
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

              <NavButtons onBack={goBack} onNext={goNext} />
            </fieldset>
          )}

          {step === 4 && (
            <fieldset className="space-y-4">
              <legend className="sr-only">Documents</legend>

              <FileField
                label="Profile photo"
                hint="A clear photo of your face"
                accept="image/*"
                file={files.profile_photo}
                onChange={setFile("profile_photo")}
                error={errors.profile_photo}
                kind="image"
              />

              {isLandlord && (
                <>
                  <Field
                    icon={Building2}
                    label="Business / establishment name"
                    value={form.business_name}
                    onChange={update("business_name")}
                    error={errors.business_name}
                    placeholder="Dela Cruz Boarding House"
                  />

                  <FileField
                    label="Valid government ID"
                    hint="Driver's license, passport, UMID, etc."
                    accept="image/*,.pdf"
                    file={files.valid_id}
                    onChange={setFile("valid_id")}
                    error={errors.valid_id}
                    kind="document"
                  />

                  <FileField
                    label="Business permit / boarding house registration"
                    hint="PDF or clear photo of the certificate"
                    accept="image/*,.pdf"
                    file={files.business_permit}
                    onChange={setFile("business_permit")}
                    error={errors.business_permit}
                    kind="document"
                  />

                  <p className="text-xs text-ink/50 leading-relaxed">
                    These documents are only visible to our review team and are
                    never shown publicly.
                  </p>
                </>
              )}

              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4">
                  {apiError}
                </div>
              )}

              <NavButtons onBack={goBack} submit loading={loading} />
            </fieldset>
          )}
        </form>

        <p className="text-center text-sm text-ink/60 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-papaya">
            Log in
          </Link>
        </p>
      </div>

      {showSuccess && (
        <SuccessModal role={role} onContinue={() => navigate("/login")} />
      )}
    </div>
  );
}

function ProgressBar({ step, labels }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {labels.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const current = num === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-bay text-white"
                    : current
                    ? "bg-papaya text-white ring-4 ring-papaya/20"
                    : "bg-white text-ink/30 border-2 border-ink/10"
                }`}
              >
                {done ? <Check size={16} /> : num}
              </div>
              <span
                className={`text-xs font-medium ${
                  current ? "text-ink" : "text-ink/40"
                }`}
              >
                {label}
              </span>
            </div>
            {num < labels.length && (
              <div
                className={`w-8 sm:w-14 h-0.5 mx-1 -mt-5 transition-colors duration-300 ${
                  done ? "bg-bay" : "bg-ink/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoleCard({ active, onClick, icon: Icon, label, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 transition-all text-center ${
        active
          ? "border-[#0e5c56] bg-[#0e5c56]/5"
          : "border-ink/10 hover:border-ink/20"
      }`}
    >
      <Icon size={24} className={active ? "text-bay" : "text-ink/40"} />
      <span className="font-semibold text-sm">{label}</span>
      <span className="text-xs text-ink/50">{sub}</span>
    </button>
  );
}

function NavButtons({
  onNext,
  onBack,
  showBack = true,
  submit = false,
  loading = false,
}) {
  return (
    <div className={`flex gap-3 pt-2 ${showBack ? "" : "justify-end"}`}>
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-ink/10 font-semibold text-sm hover:bg-ink/5 transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}
      {submit ? (
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer btn-primary flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Create account <ArrowRight size={18} />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="cursor-pointer btn-primary flex-1 rounded-2xl py-3.5 flex items-center justify-center gap-2"
        >
          Next <ArrowRight size={16} />
        </button>
      )}
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
  autoFocus = false,
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
          autoFocus={autoFocus}
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

// File input with an image preview (for photos) or a filename chip (for PDFs),
// and a clear "remove" affordance — someone uploading a business permit
// should never be unsure whether the right file actually attached.
function FileField({ label, hint, accept, file, onChange, error, kind }) {
  const previewUrl =
    kind === "image" && file && file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

  return (
    <div>
      <label className="text-sm font-semibold text-ink/70 block mb-2">
        {label}
      </label>

      {!file ? (
        <label
          className={`flex items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-3.5 cursor-pointer transition-all bg-white ${
            error ? "border-red-300" : "border-ink/15 hover:border-bay"
          }`}
        >
          <Upload size={18} className="text-ink/40 flex-shrink-0" />
          <span className="text-sm text-ink/50">{hint}</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-bay/30 bg-bay/5 px-4 py-3">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              {file.type.startsWith("image/") ? (
                <ImageIcon size={18} className="text-bay" />
              ) : (
                <FileText size={18} className="text-bay" />
              )}
            </div>
          )}
          <span className="text-sm text-ink/70 truncate flex-1">
            {file.name}
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="cursor-pointer text-ink/40 hover:text-red-500 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function SuccessModal({ role, onContinue }) {
  const isRenter = role === "renter";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-[modalIn_0.25s_ease-out]">
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
            isRenter ? "bg-bay/10" : "bg-marigold/15"
          }`}
        >
          {isRenter ? (
            <Check size={28} className="text-bay" strokeWidth={3} />
          ) : (
            <Clock size={28} className="text-marigold" strokeWidth={2.5} />
          )}
        </div>
        <h2 className="font-display font-extrabold text-2xl mb-2">
          {isRenter ? "Account created!" : "Application submitted"}
        </h2>
        <p className="text-ink/60 text-sm leading-relaxed mb-7">
          {isRenter
            ? "You're all set. Log in to start browsing verified rooms near SLSU."
            : "Thank you for registering. Our team will review your documents and notify you once a decision has been made — usually within 1–2 business days."}
        </p>
        <button
          onClick={onContinue}
          className="cursor-pointer btn-primary w-full rounded-2xl py-3.5 flex items-center justify-center gap-2"
        >
          Continue to Login <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
