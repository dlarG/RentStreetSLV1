import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, Crown } from "lucide-react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: "For Students & Renters",
      icon: "🎓",
      questions: [
        {
          q: "How do I find a room near SLSU?",
          a: "Simply open the interactive map on our homepage, drag and zoom to the SLSU area, and browse verified listings. You can filter by price, amenities, distance from campus, and more. Each listing shows real photos, exact location, and landlord details.",
        },
        {
          q: "Is RentStreet free for students?",
          a: "Yes! RentStreet is completely free for students and renters. You can browse all listings, contact landlords, and book rooms without paying anything. We make money from landlords who choose our premium plans.",
        },
        {
          q: "What is the RentStreet Trust Score?",
          a: "The Trust Score is a private rating that helps landlords know you're a responsible tenant. It's based on your payment history and check-out compliance from previous stays. Only landlords you've applied to can see your score, and you can dispute any unfair ratings with proof (like GCash receipts).",
        },
        {
          q: "Can I use the app with slow internet?",
          a: "Absolutely! RentStreet is built as a Progressive Web App (PWA). You can save listings to view offline, and we automatically compress images so they load fast even on 3G/4G connections around campus.",
        },
        {
          q: "What if the room isn't what was advertised?",
          a: "All listings are verified by our team, but if something doesn't match, you can report it directly in the app. We take listing accuracy seriously and will investigate immediately. You can also leave honest reviews after your stay.",
        },
      ],
    },
    {
      title: "For Landlords & Property Owners",
      icon: "🏠",
      questions: [
        {
          q: "How does the free Premium trial work?",
          a: "When you sign up, you get full Premium access completely free — no credit card required. This includes unlimited property listings, unlimited images per room, priority map pinning, the AI pricing calculator, and booking analytics. Your free Premium period starts when you receive your first successful tenant application through RentStreet, not from the day you sign up. You'll have a full month of Premium features to experience the platform's full potential.",
        },
        {
          q: "What happens after the free Premium trial ends?",
          a: "After your 1-month Premium trial (which starts from your first successful booking), your account automatically switches to our Freemium plan. On Freemium, you can still list 1 property with limited images per room. Some of your existing property listings and images will be locked until you upgrade back to Premium. Don't worry — your data isn't deleted, just temporarily inaccessible until you upgrade.",
        },
        {
          q: "What's included in the Freemium plan?",
          a: "The Freemium plan lets you manage 1 property with basic features: limited images per room, standard map pin placement, basic tenant management, and payment tracking via GCash or cash. It's perfect for landlords with just one boarding house who don't need advanced analytics. If you have multiple properties or want premium features, you'll need to upgrade.",
        },
        {
          q: "What does the Premium plan include?",
          a: "Premium (₱299/month) unlocks everything: unlimited property listings, unlimited images per room, priority placement on the map (your properties appear at the top of searches), access to our AI pricing calculator that suggests optimal rental rates, advanced booking analytics dashboard, and priority support. For multi-room landlords, Premium typically pays for itself with just one additional booking.",
        },
        {
          q: "How do I track tenant payments?",
          a: "Your landlord dashboard includes a payment tracking system. Mark tenants as paid/unpaid, record GCash or Maya reference numbers, and see payment history at a glance. The system automatically flags late payments and updates tenant trust scores. This feature is available on both Freemium and Premium plans.",
        },
        {
          q: "Can I screen tenants before accepting them?",
          a: "Yes! When a student applies to rent your property, you'll see their Trust Score (based on previous rental history). This helps you make informed decisions. Remember, scores are private and can only be viewed after a student applies to your specific property. This feature is available on both plans.",
        },
      ],
    },
    {
      title: "Pricing & Plans",
      icon: "💰",
      questions: [
        {
          q: "Can I switch between Freemium and Premium anytime?",
          a: "Yes! You can upgrade to Premium anytime to unlock all your properties and features. If you cancel Premium, your account reverts to Freemium at the end of your billing cycle. Your additional properties and images will be locked (not deleted) and immediately accessible again if you resubscribe.",
        },
        {
          q: "Is there a limit on how many images I can upload?",
          a: "On Premium, you can upload unlimited images per room and property. On Freemium, you're limited to 3 images per room. We automatically compress images to load fast on mobile networks, so even on Premium, your photos won't slow down the app for students browsing on 3G/4G.",
        },
        {
          q: "How many properties can I list on Freemium?",
          a: "Freemium allows 1 active property listing. If you have multiple boarding houses, you'll need Premium to list them all. During your free Premium trial, you can list unlimited properties and decide later which one to keep active on Freemium.",
        },
        {
          q: "When exactly does my free Premium trial start?",
          a: "Your free Premium trial begins the moment you receive your first successful tenant application through RentStreet — meaning a student found your listing, applied, and you approved their booking. This ensures you only start your trial when the platform is actually working for you, not while you're still setting up your listing.",
        },
      ],
    },
    {
      title: "Payments & Trust",
      icon: "🔒",
      questions: [
        {
          q: "How do payments work on RentStreet?",
          a: "RentStreet doesn't process payments directly. We provide tools to track and verify payments made through GCash, Maya, bank transfers, or cash. Landlords and tenants manage payments between themselves, and the system keeps records for trust score calculations.",
        },
        {
          q: "What if there's a payment dispute?",
          a: "If a landlord marks you as unpaid but you have proof of payment, you can file a dispute directly in the app. Upload your GCash receipt or bank transfer screenshot, and our team will review it. Your trust score is frozen during the dispute until it's resolved.",
        },
        {
          q: "Is my personal information safe?",
          a: "Yes. We comply with the Philippines' Data Privacy Act (RA 10173). Your payment history is never publicly visible. Landlords can only see your Trust Score after you apply to their property. We never share your data with third parties without consent.",
        },
        {
          q: "Can I delete my account and data?",
          a: "Absolutely. You can request full account deletion anytime, and we'll remove your personal data from our systems within 30 days, as required by law. Some anonymized data may be retained for analytics purposes.",
        },
      ],
    },
  ];

  return (
    <section id="faq" className="relative py-24 bg-mist overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-bay/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-marigold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-left mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-ink/5 shadow-sm mb-6">
            <HelpCircle size={16} className="text-bay" />
            <span className="font-mono text-xs text-papaya uppercase tracking-wider font-semibold">
              FAQ
            </span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-3xl lg:text-4xl mb-6 leading-tight">
            Questions? We've got{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#0e5c56] to-[#f2a93b] bg-clip-text text-transparent">
                answers.
              </span>
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
            </span>
          </h2>

          <p className="text-base text-ink/60 max-w-2xl leading-relaxed">
            Everything you need to know about finding rooms, listing properties,
            and how RentStreet keeps things fair for everyone.
          </p>
        </div>

        {/* Trial Highlight Banner */}
        <div className="relative mb-12 rounded-3xl bg-gradient-to-br from-bay to-bay-deep text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-marigold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-marigold/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <h3 className="font-display text-bay font-bold text-xl sm:text-2xl mb-2 flex items-center gap-2">
                <Crown size={20} className="text-marigold" />
                Try Premium free for 1 month
              </h3>
              <p className="text-bay text-sm sm:text-base leading-relaxed">
                Your free trial{" "}
                <span className="font-semibold text-bay">
                  starts when you get your first booking
                </span>{" "}
                — not when you sign up. Experience unlimited properties and
                features risk-free.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.title}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="font-display font-bold text-xl sm:text-2xl">
                  {category.title}
                </h3>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((item, index) => {
                  const globalIndex = `${categoryIndex}-${index}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={globalIndex}
                      className="group bg-white rounded-2xl border border-ink/5 hover:border-bay/20 transition-all duration-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
                      >
                        <span className="font-semibold text-ink group-hover:text-bay transition-colors pr-4">
                          {item.q}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`flex-shrink-0 text-ink/30 group-hover:text-bay transition-all duration-300 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                          <div className="w-full h-px bg-ink/5 mb-4" />
                          <p className="text-sm text-ink/60 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-bay/5 to-marigold/5 border border-bay/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bay flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-ink">
                Still have questions?
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-bay text-white text-sm font-semibold rounded-full hover:bg-bay-deep transition-colors shadow-lg shadow-bay/20"
            >
              Contact our team
              <ChevronDown size={16} className="rotate-[-90deg]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
