import { useState, useEffect } from "react";
import { Users, Mail, Phone, Building2, Loader2 } from "lucide-react";
import api from "../../../lib/api";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace("/api/v1", "");
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const STATUS_STYLES = {
  pending: "bg-marigold/10 text-marigold",
  active: "bg-green-50 text-green-600",
  completed: "bg-ink/5 text-ink/50",
  terminated: "bg-red-50 text-red-600",
};

function MyTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "RentStreet | My Tenants";
    api
      .get("/landlord/tenants")
      .then((res) => setTenants(res.data))
      .catch((err) =>
        setErrorMsg(err.response?.data?.detail || "Couldn't load tenants.")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
          My Tenants
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Everyone currently or previously renting across your properties.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin text-bay" size={28} />
        </div>
      ) : tenants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink/5 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-mist flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-ink/20" />
          </div>
          <p className="text-ink/40 font-medium">No tenants yet</p>
          <p className="text-sm text-ink/30 mt-1">
            Tenants will appear here once rental applications are accepted.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tenants.map((t) => (
            <div
              key={t.tenancy_id}
              className="bg-white rounded-2xl border border-ink/5 p-5"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  {t.renter_photo_url ? (
                    <img
                      src={fileUrl(t.renter_photo_url)}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-bay to-marigold flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {t.renter_name?.[0]}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {t.renter_name}
                    </p>
                    <p className="text-xs text-ink/50">
                      Trust score:{" "}
                      <span className="font-semibold">
                        {t.trust_score != null ? t.trust_score.toFixed(0) : "—"}
                      </span>
                    </p>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    STATUS_STYLES[t.status]
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <div className="space-y-1.5 text-sm text-ink/60 mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-ink/30" /> {t.renter_email}
                </div>
                {t.renter_phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-ink/30" /> {t.renter_phone}
                  </div>
                )}
              </div>

              <div className="border-t border-ink/5 pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-ink/50">
                  <Building2 size={13} /> {t.boarding_house_name} —{" "}
                  {t.room_label}
                </div>
                <span className="font-semibold text-bay">
                  ₱{t.monthly_rate.toLocaleString()}/mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTenants;
