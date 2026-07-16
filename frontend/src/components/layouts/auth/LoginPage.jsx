import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Loader2 } from "lucide-react";
import { useAuth, ROLE_ROUTES } from "../../../context/AuthContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-paper flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="w-9 h-9 flex items-center justify-center bg-bay rounded-full">
            <MapPin className="text-white" size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-xl">
            RentStreet
          </span>
        </div>

        <div className="bg-mist rounded-3xl p-8">
          <h1 className="font-display font-bold text-2xl mb-1">Welcome back</h1>
          <p className="text-sm text-ink/60 mb-6">
            Log in to find or manage your listings.
          </p>

          {error && (
            <div className="bg-papaya/10 border border-papaya/30 text-papaya text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Email or phone number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@email.com or 09171234567"
                required
                className="w-full rounded-xl border border-ink/15 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-bay"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-ink/15 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-bay"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-center text-ink/60 mt-6">
            New to RentStreet?{" "}
            <Link to="/register" className="text-bay font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
