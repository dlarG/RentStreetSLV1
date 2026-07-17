import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function ContactUs() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email us",
      value: "hello@rentstreet.ph",
      href: "mailto:hello@rentstreet.ph",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Phone,
      label: "Call or text",
      value: "+63 917 000 0000",
      href: "tel:+639170000000",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: MapPin,
      label: "Find us",
      value: "Sogod, Southern Leyte",
      href: "https://maps.google.com/?q=Sogod+Southern+Leyte",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-marigold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-bay/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-ink/5 shadow-sm mb-6 w-fit">
              <MessageCircle size={16} className="text-bay" />
              <span className="font-mono text-xs text-papaya uppercase tracking-wider font-semibold">
                Get in touch
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-3xl lg:text-4xl mb-6 leading-tight">
              Let's find your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#0e5c56] to-[#f2a93b] bg-clip-text text-transparent">
                  perfect room
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

            <p className="text-base text-ink/60 leading-relaxed mb-10 max-w-md">
              We're a small team based right in Sogod. Message us and a real
              person will get back to you —{" "}
              <span className="font-semibold text-ink">
                usually the same day.
              </span>
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-10">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-ink/5 hover:border-bay/20 hover:shadow-lg hover:shadow-bay/5 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} className={color.split(" ")[1]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink/40 font-medium mb-0.5">
                      {label}
                    </p>
                    <p className="font-semibold text-ink group-hover:text-bay transition-colors truncate">
                      {value}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-ink/20 group-hover:text-bay group-hover:translate-x-1 transition-all duration-300"
                  />
                </a>
              ))}
            </div>

            {/* Response Time Badge */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-bay/5 to-marigold/5 border border-bay/10 mb-10">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-bay" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">
                  Fast response guaranteed
                </p>
                <p className="text-xs text-ink/50">
                  We typically reply within 2-4 hours
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-semibold text-ink/60 mb-3">
                Follow our journey
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/rentstreet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 rounded-2xl bg-white border border-ink/5 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#1877F2]/20 hover:-translate-y-1"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://instagram.com/rentstreet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 rounded-2xl bg-white border border-ink/5 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:border-transparent hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#E1306C]/20 hover:-translate-y-1"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-ink/5 border border-ink/5">
                {/* Form header */}
                <div className="mb-8">
                  <h3 className="font-display font-bold text-2xl mb-2">
                    Send us a message
                  </h3>
                </div>

                <form
                  className="space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-ink/70 block mb-2">
                        Full name
                      </label>
                      <input
                        type="text"
                        placeholder="Juan Dela Cruz"
                        className="w-full rounded-2xl border-2 border-ink/10 px-5 py-3.5 bg-mist/50 focus:bg-white  transition-all duration-300 placeholder:text-ink/30"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-ink/70 block mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        placeholder="you@email.com"
                        className="w-full rounded-2xl border-2 border-ink/10 px-5 py-3.5 bg-mist/50 focus:bg-white  transition-all duration-300 placeholder:text-ink/30"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-ink/70 block mb-2">
                        I'm looking for...
                      </label>
                      <select className="w-full rounded-2xl border-2 border-ink/10 px-5 py-3.5 bg-mist/50 focus:bg-white  transition-all duration-300 text-ink/60">
                        <option value="to rent" disabled selected>
                          A room to rent
                        </option>
                        <option value="renter">I want to find a room</option>
                        <option value="landlord">
                          I want to list my property
                        </option>
                        <option value="other">Something else</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-ink/70 block mb-2">
                        Your message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="I'm looking for a room near SLSU main campus with WiFi and..."
                        className="w-full rounded-2xl border-2 border-ink/10 px-5 py-3.5 bg-mist/50 focus:bg-white  transition-all duration-300 resize-none placeholder:text-ink/30"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cursor-pointer group relative w-full bg-papaya hover:bg-papaya-deep text-white font-semibold rounded-2xl py-4 transition-all duration-300 hover:shadow-xl hover:shadow-papaya/20 hover:-translate-y-0.5 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Send message
                      <Send
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-marigold/0 via-marigold/20 to-marigold/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>

                  <p className="text-xs text-center text-ink/30">
                    By sending, you agree to our{" "}
                    <a
                      href="#"
                      className="underline hover:text-ink/50 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </form>

                {/* Decorative corner gradient */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-papaya to-marigold rounded-full opacity-10 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-marigold to-bay rounded-full opacity-10 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
