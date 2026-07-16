import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRoles,
  requireApproved = false,
  children,
}) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;

  if (requireApproved && user.approval_status !== "accepted") {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display font-bold text-2xl mb-2">
            {user.approval_status === "rejected"
              ? "Application not approved"
              : "Application under review"}
          </h1>
          <p className="text-ink/60 max-w-sm">
            {user.approval_status === "rejected"
              ? "Your landlord application wasn't approved. Contact support if you think this is a mistake."
              : "We're reviewing your landlord account. You'll be notified once it's approved — usually within 1–2 business days."}
          </p>
        </div>
      </div>
    );
  }

  return children;
}
