import { MapPin, Star } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-bay-deep text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 flex items-center justify-center bg-marigold rounded-full">
                <MapPin className="text-bay-deep" size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display font-extrabold text-lg">
                RentStreet
              </span>
            </div>
            <p className="text-sm text-white/60 max-w-[220px]">
              The room-hunting map for SLSU students and beyond.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wide text-white/50">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a href="#why-us" className="hover:text-marigold">
                  Why RentStreet
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-marigold">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-marigold">
                  Browse rooms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wide text-white/50">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a href="#contact" className="hover:text-marigold">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-marigold">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wide text-white/50">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-marigold">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-marigold">
                  Trust Score & RA 10173
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <span>© 2026 RentStreet. Piloted in Sogod, Southern Leyte.</span>
          <span className="flex items-center gap-1 font-mono">
            <Star size={12} className="text-marigold" fill="#F2A93B" /> Made for
            SLSU students
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
