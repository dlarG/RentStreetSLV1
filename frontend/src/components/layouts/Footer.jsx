import {
  MapPin,
  ArrowUpRight,
  Heart,
  Shield,
  ChevronRight,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-mist to-[#14231f] text-white pt-20 pb-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-marigold/5 rounded-full blur-3xl translate-x-1/4 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-bay/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Top CTA Section */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#f2a93b]/10 to-[#0e5c56]/10 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2">
                Ready to find your perfect room?
              </h3>
              <p className="text-white/60 text-sm sm:text-base">
                Join hundreds of SLSU students who found their home through
                RentStreet.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#faf8f2] text-[#0a3b37] font-semibold rounded-full hover:bg-marigold hover:text-bay-deep transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-marigold/20"
              >
                Browse rooms
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                List your property
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img
                  src="asset/logo/5-circled-modified.png"
                  alt="RentStreet Logo"
                  className="h-12 rounded-full transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">
                RentStreet
              </span>
            </div>
            <p className="text-sm text-white/60 mb-6 max-w-sm leading-relaxed">
              The room-hunting map built specifically for SLSU students. Find
              verified boarding houses, dorms, and apartments — all within
              walking distance from campus.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/rentstreet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 hover:shadow-lg hover:shadow-[#1877F2]/20 hover:-translate-y-1"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://instagram.com/rentstreet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:border-transparent transition-all duration-300 hover:shadow-lg hover:shadow-[#E1306C]/20 hover:-translate-y-1"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-black hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1"
              >
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Columns */}
          <div>
            <h4 className="font-display font-bold mb-5 text-sm uppercase tracking-wider text-marigold">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Browse Rooms", href: "#" },
                { label: "Why RentStreet", href: "#why-us" },
                { label: "Pricing", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="text-white/20 group-hover:text-marigold group-hover:translate-x-1 transition-all"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-5 text-sm uppercase tracking-wider text-marigold">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#" },
                { label: "Contact", href: "#contact" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="text-white/20 group-hover:text-marigold group-hover:translate-x-1 transition-all"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-5 text-sm uppercase tracking-wider text-marigold">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Trust Score & RA 10173", href: "#" },
                { label: "Cookie Policy", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="text-white/20 group-hover:text-marigold group-hover:translate-x-1 transition-all"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-white/40">
            <span>© {currentYear} RentStreet. All rights reserved.</span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-marigold" />
              Piloted in Sogod, Southern Leyte
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Trust Indicators */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Shield size={14} className="text-marigold" />
              <span>RA 10173 Compliant</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <Heart size={12} className="text-marigold" fill="#F2A93B" />
              <span>Made for Students and Boarding House Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
