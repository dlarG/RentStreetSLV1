import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, MapPin } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <a href="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="relative">
                <img
                  src="asset/logo/5-circled-modified.png"
                  alt="RentStreet Logo"
                  className="h-12 rounded-full"
                />
                <div className="absolute inset-0 rounded-full bg-bay/10 blur-md" />
              </div>
              <span className="font-display font-extrabold text-2xl">
                <span className="text-bay">Rent</span>Street
              </span>
            </a>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">
              Welcome back
            </h1>
            <p className="text-ink/60 text-sm">
              Sign in to manage your listings or find your next room.
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-ink/10 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 transition-all duration-300 font-medium text-sm">
              <FaFacebook size={18} className="text-[#1877F2]" />
              Facebook
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-ink/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300 font-medium text-sm">
              <FaGoogle size={18} className="text-red-500" />
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
                or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full rounded-2xl border-2 border-ink/10 pl-12 pr-4 py-3.5 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
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
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-2xl border-2 border-ink/10 pl-12 pr-12 py-3.5 bg-mist/50 focus:bg-white focus:outline-none focus:border-bay focus:ring-4 focus:ring-bay/10 transition-all duration-300 placeholder:text-ink/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
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
                href="#"
                className="text-sm font-semibold text-bay hover:text-bay-deep transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-bay hover:bg-bay-deep text-white font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-xl hover:shadow-bay/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
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
              <div className="absolute inset-0 bg-gradient-to-r from-marigold/0 via-marigold/20 to-marigold/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-ink/60 mt-8">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-bay hover:text-bay-deep transition-colors"
            >
              Create one now
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-bay to-bay-deep overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="relative flex flex-col justify-center px-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6">
              <MapPin size={16} className="text-marigold" />
              <span className="text-xs font-semibold text-white/80">
                SLSU • Sogod, Southern Leyte
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-white mb-4 leading-tight">
              Find your perfect <span className="text-marigold">room</span> near
              campus.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Join hundreds of SLSU students who found their home through
              RentStreet.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="font-display font-extrabold text-3xl text-marigold mb-1">
                50+
              </div>
              <div className="text-sm text-white/60">Verified Properties</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="font-display font-extrabold text-3xl text-marigold mb-1">
                300+
              </div>
              <div className="text-sm text-white/60">Happy Students</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="font-display font-extrabold text-3xl text-marigold mb-1">
                98%
              </div>
              <div className="text-sm text-white/60">Match Rate</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="font-display font-extrabold text-3xl text-marigold mb-1">
                2.4km
              </div>
              <div className="text-sm text-white/60">
                Avg. Distance to Campus
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
