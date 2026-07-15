import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Check,
  Shield,
} from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("renter"); // 'renter' or 'landlord'
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToTrustScore, setAgreeToTrustScore] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Handle registration logic here
  };

  const passwordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: 2, label: "Fair", color: "bg-orange-500" };
    if (password.length < 14)
      return { strength: 3, label: "Good", color: "bg-yellow-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-bay to-bay-deep overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="relative flex flex-col justify-center px-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6">
              <Shield size={16} className="text-marigold" />
              <span className="text-xs font-semibold text-white/80">
                Secure Registration • RA 10173 Compliant
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-white mb-4 leading-tight">
              Start your journey with{" "}
              <span className="text-marigold">RentStreet</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Join our community of students and landlords making room hunting
              easier in Sogod.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            {[
              { icon: MapPin, text: "Interactive map search around SLSU" },
              { icon: Shield, text: "Trust Score system for safer rentals" },
              { icon: Check, text: "Verified property listings only" },
              { icon: User, text: "Free for students, trial for landlords" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-marigold" />
                </div>
                <span className="text-white/70 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="relative">
                <img
                  src="asset/logo/5-circled-modified.png"
                  alt="RentStreet Logo"
                  className="h-10 rounded-full"
                />
                <div className="absolute inset-0 rounded-full bg-bay/10 blur-md" />
              </div>
              <span className="font-display font-extrabold text-xl">
                <span className="text-bay">Rent</span>Street
              </span>
            </a>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">
              Create your account
            </h1>
            <p className="text-ink/60 text-sm">
              Find rooms or list properties in minutes.
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { type: "renter", label: "I'm a Student", icon: "🎓" },
              { type: "landlord", label: "I'm a Landlord", icon: "🏠" },
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  userType === type
                    ? "border-bay bg-bay/5 text-bay shadow-lg shadow-bay/10"
                    : "border-ink/10 text-ink/60 hover:border-ink/20"
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span className="font-semibold text-sm">{label}</span>
              </button>
            ))}
          </div>

          {/* Social Register Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-ink/10 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 transition-all duration-300 font-medium text-sm">
              <FaFacebook size={16} className="text-[#1877F2]" />
              Facebook
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-ink/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 font-medium text-sm">
              <FaGoogle size={16} className="text-red-500" />
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-ink/40 font-medium">
                or register with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="w-full rounded-xl border-2 border-ink/10 px-4 py-3 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dela Cruz"
                  required
                  className="w-full rounded-xl border-2 border-ink/10 px-4 py-3 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  required
                  className="w-full rounded-xl border-2 border-ink/10 pl-12 pr-4 py-3 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Phone number (optional)
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+63 917 000 0000"
                  className="w-full rounded-xl border-2 border-ink/10 pl-12 pr-4 py-3 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-xl border-2 border-ink/10 pl-12 pr-12 py-3 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= strength.strength
                            ? strength.color
                            : "bg-ink/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-ink/40">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-ink/70 block mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="w-full rounded-xl border-2 border-ink/10 pl-12 pr-12 py-3 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-ink/20 text-bay focus:ring-bay/20"
                />
                <span className="text-sm text-ink/60">
                  I agree to the{" "}
                  <a href="#" className="text-bay hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-bay hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Trust Score Consent - Only for renters */}
              {userType === "renter" && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTrustScore}
                    onChange={(e) => setAgreeToTrustScore(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-ink/20 text-bay focus:ring-bay/20"
                  />
                  <span className="text-sm text-ink/60">
                    I consent to my payment history and check-out compliance
                    being tracked to generate my{" "}
                    <span className="font-semibold text-ink">
                      RentStreet Trust Score
                    </span>
                    . I understand I can dispute any inaccuracies.
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isLoading ||
                !agreeToTerms ||
                (userType === "renter" && !agreeToTrustScore)
              }
              className="group relative w-full bg-bay hover:bg-bay-deep text-white font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-xl hover:shadow-bay/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-6"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-marigold/0 via-marigold/20 to-marigold/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-ink/60 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-bay hover:text-bay-deep transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
