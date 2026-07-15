import { Check, Star, Zap, ArrowUpRight } from "lucide-react";

function Pricing() {
  const freeFeatures = [
    { text: "List unlimited rooms & bed spaces", highlight: true },
    { text: "Tenant & payment management dashboard", highlight: false },
    { text: "Basic map pin on search results", highlight: false },
    { text: "GCash, Maya & cash tracking", highlight: true },
    { text: "1-month free trial, no card needed", highlight: true },
  ];

  const premiumFeatures = [
    { text: "Everything in Free, plus:", highlight: false },
    { text: "Priority map pinning (top of search)", highlight: true },
    { text: "AI pricing calculator & suggestions", highlight: true },
    { text: "Advanced booking analytics dashboard", highlight: true },
    { text: "Priority support from Sogod team", highlight: false },
  ];

  return (
    <section
      id="pricing"
      className="relative max-w-6xl mx-auto px-5 sm:px-8 py-24 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-bay/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-marigold/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-ink/5 shadow-sm mb-6">
            <Zap size={16} className="text-marigold" />
            <span className="font-mono text-xs text-papaya uppercase tracking-wider font-semibold">
              For landlords
            </span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl mb-6 leading-tight">
            Start free. Upgrade when{" "}
            <span className="relative inline-block">
              <span className="relative z-10">it's paying</span>
            </span>{" "}
            for itself.
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {/* Free Trial Card */}
          <div className="group relative bg-white rounded-3xl p-8 sm:p-10 border-2 border-ink/5 hover:border-bay/20 transition-all duration-500 hover:shadow-2xl hover:shadow-bay/5">
            {/* Card hover gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-bay/0 to-marigold/0 group-hover:from-bay/[0.02] group-hover:to-marigold/[0.05] transition-all duration-500" />

            <div className="relative">
              <h3 className="font-display font-bold text-2xl mb-2">
                Free Trial
              </h3>
              <p className="text-sm text-ink/50 leading-relaxed mb-8">
                30 days to experience everything. No strings attached.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display font-extrabold text-6xl">₱0</span>
                <span className="text-ink/40 font-medium">/first month</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {freeFeatures.map(({ text, highlight }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        highlight ? "bg-bay/10" : "bg-ink/5"
                      }`}
                    >
                      <Check
                        size={12}
                        className={highlight ? "text-bay" : "text-ink/30"}
                      />
                    </div>
                    <span
                      className={`text-sm leading-relaxed ${
                        highlight ? "text-ink font-medium" : "text-ink/50"
                      }`}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className="group/btn relative inline-flex items-center justify-center w-full bg-mist hover:bg-bay text-ink hover:text-ink font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-lg hover:shadow-bay/20"
              >
                Start free trial
                <ArrowUpRight
                  size={18}
                  className="ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                />
              </a>

              <p className="text-xs text-center text-ink/30 mt-4">
                No credit card required
              </p>
            </div>
          </div>

          {/* Premium Card */}
          <div className="group relative bg-gradient-to-br from-[#0a3b37] to-[#0e5c56] rounded-3xl p-8 sm:p-10 text-white hover:shadow-2xl hover:shadow-bay/30 transition-all duration-500 hover:-translate-y-2">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-marigold text-ink font-mono text-xs font-bold px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Star size={14} className="fill-ink" />
                MOST POPULAR
              </div>
            </div>

            {/* Card decorative glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-marigold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              {/* Tier Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6 mt-2">
                <Zap size={14} className="text-marigold" />
                <span className="text-xs font-semibold text-white/80">
                  PREMIUM
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl mb-2">Premium</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                For landlords ready to maximize occupancy and revenue.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display font-extrabold text-6xl">
                  ₱299
                </span>
                <span className="text-white/50 font-medium">/month</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {premiumFeatures.map(({ text, highlight }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        highlight ? "bg-marigold/20" : "bg-white/10"
                      }`}
                    >
                      <Check
                        size={12}
                        className={
                          highlight ? "text-marigold" : "text-white/40"
                        }
                      />
                    </div>
                    <span
                      className={`text-sm leading-relaxed ${
                        highlight ? "text-white font-medium" : "text-white/50"
                      }`}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className="group/btn relative inline-flex items-center justify-center w-full bg-marigold hover:bg-white text-ink font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-2xl hover:shadow-marigold/30"
              >
                Upgrade to Premium
                <ArrowUpRight
                  size={18}
                  className="ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                />
              </a>

              <p className="text-xs text-center text-white/30 mt-4">
                Cancel anytime • Billed monthly
              </p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-ink/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Secure GCash & Maya integration
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            15-20% trial-to-paid conversion
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Priority support from Sogod team
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
