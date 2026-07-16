import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth, ROLE_ROUTES } from "../../../context/AuthContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "RentStreet | Login";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(identifier, password);
      navigate(ROLE_ROUTES[user.role] || "/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eff5f1] flex items-center justify-center px-5 sm:px-8 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="asset/logo/5-circled-modified.png"
                alt="RentStreet Logo"
                className="h-15 rounded-full transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-bay/10 blur-md" />
            </div>
          </Link>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">
            Welcome back
          </h1>
          <p className="text-ink/60 text-sm">
            Sign in to manage your listings or find your next room.
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-ink/10 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 transition-all duration-300 font-medium text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
          <button className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-ink/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 font-medium text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ink/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-paper px-4 text-ink/40 font-medium">
              or continue with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email/Phone Field */}
          <div>
            <label className="text-sm font-semibold text-ink/70 block mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
              />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full rounded-2xl border-2 border-ink/10 pl-12 pr-4 py-3.5 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-1 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
              />
            </div>
          </div>

          {/* Password Field */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border-2 border-ink/10 pl-12 pr-12 py-3.5 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-1 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-ink/20 text-bay focus:ring-bay/20"
              />
              <span className="text-sm text-ink/60">Remember me</span>
            </label>
            <a
              href="/forgot-password"
              className="text-sm font-semibold text-bay hover:text-bay-deep transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer group relative w-full bg-papaya hover:bg-marigold text-white font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-xl hover:shadow-papaya/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-ink/60 mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-papaya hover:text-marigold transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
