import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function ContactUs() {
  return (
    <section
      id="contact"
      className="max-w-6xl mx-auto px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-12"
    >
      <div>
        <span className="font-mono text-xs text-papaya uppercase tracking-wider">
          Get in touch
        </span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 mb-6">
          Questions before you list or apply?
        </h2>
        <p className="text-ink/70 mb-8 max-w-sm">
          We're a small team based right in Sogod. Message us and a real person
          will get back to you — usually the same day.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-bay" /> hello@rentstreet.ph
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-bay" /> +63 917 000 0000
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-bay" /> Sogod, Southern Leyte,
            Philippines
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-mist flex items-center justify-center hover:bg-bay hover:text-white"
          >
            <FaFacebook size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-mist flex items-center justify-center hover:bg-bay hover:text-white"
          >
            <FaInstagram size={18} />
          </a>
        </div>
      </div>

      <form
        className="bg-mist rounded-3xl p-6 sm:p-8 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="text-sm font-semibold block mb-1.5">Name</label>
          <input
            type="text"
            placeholder="Juan Dela Cruz"
            className="w-full rounded-xl border border-ink/15 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-bay"
          />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-xl border border-ink/15 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-bay"
          />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1.5">Message</label>
          <textarea
            rows={4}
            placeholder="I'm looking for a room near..."
            className="w-full rounded-xl border border-ink/15 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-bay resize-none"
          />
        </div>
        <button type="submit" className="btn-primary w-full rounded-full py-3">
          Send message
        </button>
      </form>
    </section>
  );
}

export default ContactUs;
