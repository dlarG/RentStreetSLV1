import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, MapPin } from "lucide-react";

function NotFound() {
  useEffect(() => {
    document.title = "RentStreet | Page Not Found";
  }, []);
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-5 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bay/3 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-marigold/5 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />

      <div className="relative text-center max-w-md">
        {/* 404 Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#0e5c56] to-[#0a3b37] flex items-center justify-center shadow-2xl shadow-bay/20">
            <MapPin size={48} className="sm:w-16 sm:h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-marigold flex items-center justify-center shadow-lg shadow-marigold/30">
            <span className="text-white text-sm sm:text-base font-bold">?</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="font-display font-extrabold text-5xl sm:text-7xl mb-4 bg-gradient-to-r from-bay to-marigold bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="font-display font-bold text-xl sm:text-2xl mb-3">
          Room Not Found
        </h2>
        <p className="text-ink/60 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Looks like this page has moved out. Maybe it graduated, transferred
          schools, or never existed in the first place.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-bay hover:bg-bay-deep text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-bay/20"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-ink/10 hover:border-bay/30 text-ink/60 hover:text-bay font-semibold rounded-2xl transition-all duration-300 hover:bg-bay/5"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-ink/5">
          <p className="text-xs text-ink/40 mb-4">Looking for something?</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/"
              className="text-xs px-3 py-1.5 rounded-full bg-mist hover:bg-bay/10 hover:text-bay text-ink/60 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#why-us"
              className="text-xs px-3 py-1.5 rounded-full bg-mist hover:bg-bay/10 hover:text-bay text-ink/60 transition-colors"
            >
              Why RentStreet
            </Link>
            <Link
              to="/#pricing"
              className="text-xs px-3 py-1.5 rounded-full bg-mist hover:bg-bay/10 hover:text-bay text-ink/60 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/#faq"
              className="text-xs px-3 py-1.5 rounded-full bg-mist hover:bg-bay/10 hover:text-bay text-ink/60 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/#contact"
              className="text-xs px-3 py-1.5 rounded-full bg-mist hover:bg-bay/10 hover:text-bay text-ink/60 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-xs px-3 py-1.5 rounded-full bg-mist hover:bg-bay/10 hover:text-bay text-ink/60 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
