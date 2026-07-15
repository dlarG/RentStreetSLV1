import { Check } from "lucide-react";

function Pricing() {
  return (
    <section id="pricing" className="bg-mist py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-xl mb-12">
          <span className="font-mono text-xs text-papaya uppercase tracking-wider">
            For landlords
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3">
            Start free. Upgrade when it's paying for itself.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          <div className="bg-white rounded-3xl p-8 border-2 border-ink/10">
            <h3 className="font-display font-bold text-xl">Free Trial</h3>
            <p className="text-sm text-ink/60 mt-1">
              First month, no card required
            </p>
            <div className="font-mono text-4xl font-bold mt-6">₱0</div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "List unlimited rooms",
                "Manage tenants & payments",
                "Basic map pin",
                "GCash or cash tracking",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-bay" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="btn-outline block text-center rounded-full mt-8 py-3"
            >
              Get started
            </a>
          </div>

          <div className="bg-bay-deep text-white rounded-3xl p-8 relative overflow-hidden">
            <span className="absolute top-6 right-6 bg-marigold text-ink text-xs font-mono font-bold px-3 py-1 rounded-full">
              Popular
            </span>
            <h3 className="font-display font-bold text-xl">Premium</h3>
            <p className="text-sm text-white/60 mt-1">
              Billed monthly, cancel anytime
            </p>
            <div className="font-mono text-4xl font-bold mt-6">
              ₱299<span className="text-base font-normal">/mo</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Everything in Free",
                "Priority map pinning",
                "ML pricing calculator",
                "Booking analytics dashboard",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-marigold" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="btn-primary block text-center rounded-full mt-8 py-3"
            >
              Upgrade to Premium
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
