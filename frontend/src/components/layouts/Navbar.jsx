import { useState } from "react";
import { X, Menu } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = ["Home", "Why Us", "Pricing", "Contact"];
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <img
            src="asset/logo/5-circled-modified.png"
            alt="RentStreet Logo"
            className="h-12 rounded-full"
          />
          <span className="font-display font-extrabold text-lg tracking-tight">
            RentStreet
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="hover:text-bay transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm font-semibold hover:text-bay">
            Log in
          </a>
          <a
            href="#pricing"
            className="btn-primary text-sm px-4 py-2 rounded-full"
          >
            List your room
          </a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-paper border-t border-ink/10 px-5 py-4 flex flex-col gap-4 font-medium">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="#pricing"
            className="btn-primary text-sm px-4 py-2.5 rounded-full text-center"
            onClick={() => setOpen(false)}
          >
            List your room
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
