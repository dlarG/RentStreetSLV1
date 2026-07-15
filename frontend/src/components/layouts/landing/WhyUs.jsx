import { MapPin, SlidersHorizontal, Wifi, ShieldCheck } from "lucide-react";

function WhyUs() {
  const features = [
    {
      icon: MapPin,
      title: "Real map, real distances",
      desc: "Drag, pinch, and zoom to see exactly how far a room is from the SLSU main gate — not a vague barangay name.",
    },
    {
      icon: SlidersHorizontal,
      title: "Filters that actually matter here",
      desc: "Curfew, cooking rules, sub-metered bills, water pressure. The stuff that Facebook posts never mention.",
    },
    {
      icon: Wifi,
      title: "Works on weak signal",
      desc: "Save a listing once and reopen it later, even with no load — built for 3G areas around campus.",
    },
    {
      icon: ShieldCheck,
      title: "A trust score, not a blacklist",
      desc: "Landlords see your rental history only after you apply. You can always dispute and upload proof.",
    },
  ];
  return (
    <section id="why-us" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
      <div className="max-w-xl mb-12">
        <span className="font-mono text-xs text-papaya uppercase tracking-wider">
          Why RentStreet
        </span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3">
          Built for how students in Sogod actually search.
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-mist rounded-2xl p-6 hover:bg-bay hover:text-white transition-colors group"
          >
            <div className="w-11 h-11 rounded-xl bg-bay group-hover:bg-white flex items-center justify-center mb-5">
              <Icon size={20} className="text-white group-hover:text-bay" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-ink/70 group-hover:text-white/80">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyUs;
