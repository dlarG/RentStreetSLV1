import {
  MapPin,
  SlidersHorizontal,
  Wifi,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function WhyUs() {
  const features = [
    {
      icon: MapPin,
      title: "Real map, real distances",
      desc: "Drag, pinch, and zoom to see exactly how far a room is from the SLSU main gate — not a vague barangay name.",
      gradient: "from-emerald-500 to-teal-600",
      stat: "50+",
      statLabel: "Verified properties mapped",
    },
    {
      icon: SlidersHorizontal,
      title: "Filters that actually matter",
      desc: "Curfew, cooking rules, sub-metered bills, water pressure. The stuff that Facebook posts never mention.",
      gradient: "from-amber-500 to-orange-600",
      stat: "12+",
      statLabel: "Local-specific filters",
    },
    {
      icon: Wifi,
      title: "Works on weak signal",
      desc: "Save a listing once and reopen it later, even with no load — built for 3G areas around campus.",
      gradient: "from-blue-500 to-cyan-600",
      stat: "Offline",
      statLabel: "PWA-enabled access",
    },
    {
      icon: ShieldCheck,
      title: "Trust, not blacklists",
      desc: "Landlords see your rental history only after you apply. Dispute anything unfair with proof.",
      gradient: "from-purple-500 to-indigo-600",
      stat: "100%",
      statLabel: "Disputable scores",
    },
  ];

  return (
    <section id="why-us" className="relative bg-mist py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-marigold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bay/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header Section */}
        <div className="relative max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-marigold/10 border border-marigold/20 mb-6">
            <Sparkles size={16} className="text-marigold" />
            <span className="font-mono text-xs text-marigold uppercase tracking-wider font-semibold">
              Why RentStreet
            </span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-3xl lg:text-4xl mt-4 mb-6 leading-tight">
            Built for how students in{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Sogod</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 6 Q 25 12, 50 6 Q 75 0, 100 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-marigold/40"
                />
              </svg>
            </span>{" "}
            actually search.
          </h2>
        </div>

        {/* Features Grid */}
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(
            ({ icon: Icon, title, desc, gradient, stat, statLabel }) => (
              <div
                key={title}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 hover:shadow-2xl hover:shadow-bay/10 transition-all duration-500 hover:-translate-y-2 border border-ink/5 flex flex-col"
              >
                {/* Gradient border effect on hover */}
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, var(--bay), var(--marigold))`,
                  }}
                />

                {/* Top Content Area */}
                <div className="flex-1">
                  {/* Icon Container with gradient */}
                  <div
                    className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                      <Icon
                        size={24}
                        className="text-ink group-hover:text-bay transition-colors duration-300"
                      />
                    </div>
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold text-xl mb-3 group-hover:text-bay transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-sm text-ink/60 leading-relaxed group-hover:text-ink/80 transition-colors duration-300">
                    {desc}
                  </p>
                </div>

                {/* Fixed Bottom Stats Badge */}
                <div className="flex items-center justify-between pt-4 mt-6 border-t border-ink/5">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-2xl bg-gradient-to-r from-bay to-marigold bg-clip-text text-transparent">
                      {stat}
                    </span>
                    <span className="text-xs text-ink/40 font-medium">
                      {statLabel}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
