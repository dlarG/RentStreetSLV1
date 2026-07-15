import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const LINKS = [
  { label: "Home", id: "home" },
  { label: "Why Us", id: "why-us" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  // Subtle "solidify" effect once the page scrolls past the hero top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // FIXED: Added a small timeout to let all sibling components render first
  useEffect(() => {
    let observer;

    const setupObserver = () => {
      const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
        Boolean
      );

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          });
        },
        // Root margin modified slightly to be more responsive to taller sections
        { rootMargin: "-20% 0px -60% 0px" }
      );

      sections.forEach((s) => observer.observe(s));
    };

    // Delay lookup by 100ms so FAQ and Contact IDs actually exist in the DOM
    const timer = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goTo = (id) => {
    setOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 p-2 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-paper/90 backdrop-blur-md shadow-sm border-ink/10"
            : "bg-paper/95 border-ink/10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => goTo("home")}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <img
              src="asset/logo/5-circled-modified.png"
              alt="RentStreet Logo"
              className="h-12 rounded-full transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-display font-extrabold text-xl tracking-tight">
              RentStreet
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
            {LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={`cursor-pointer relative px-4 py-2 rounded-full transition-colors ${
                  active === id
                    ? "text-papaya"
                    : "text-ink/70 hover:text-papaya"
                }`}
              >
                {/* Active background pill */}
                {active === id && (
                  <span className="absolute inset-0 bg-papaya/10 rounded-full" />
                )}
                <span className="relative z-10">{label}</span>

                {/* Active dot indicator */}
                {active === id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-papaya rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to={"/login"}
              href="#"
              className="text-sm font-semibold hover:text-bay"
            >
              Log in
            </Link>
            <a
              href="#pricing"
              className="btn-primary text-sm px-4 py-2 rounded-full"
            >
              List your room
            </a>
          </div>

          <button
            className="md:hidden relative z-50 cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu panel — fixed/overlay, never pushes page content */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 bg-paper border-b border-ink/10 md:hidden transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="px-5 py-4 flex flex-col gap-1 font-medium">
          {LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className={`relative text-left px-4 py-2.5 rounded-xl transition-colors ${
                active === id
                  ? "text-bay"
                  : "text-ink/70 hover:bg-mist hover:text-ink"
              }`}
            >
              {/* Active background for mobile */}
              {active === id && (
                <span className="absolute inset-0 bg-bay/10 rounded-xl" />
              )}
              <span className="relative z-10 flex items-center justify-between">
                {label}
                {active === id && (
                  <span className="w-1.5 h-1.5 bg-bay rounded-full" />
                )}
              </span>
            </button>
          ))}
          <a
            href="#pricing"
            className="btn-primary text-sm px-4 py-2.5 rounded-full text-center mt-2"
            onClick={() => setOpen(false)}
          >
            List your room
          </a>
        </div>
      </div>
    </>
  );
}

export default Navbar;
