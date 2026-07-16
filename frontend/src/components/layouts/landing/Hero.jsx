import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section
      id="home"
      className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-25 items-center"
    >
      <div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
          Finding a room in <span className="text-papaya">Sogod</span> shouldn't
          feel like a scavenger hunt.
        </h1>
        <p className="mt-6 text-lg text-ink/70 max-w-md">
          Skip the scattered Facebook posts. Browse verified boarding houses on
          a real map, filter by curfew, Wi-Fi, and cooking rules, and message
          landlords directly — even offline.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="#pricing"
            className="btn-primary rounded-full px-6 py-3.5 text-center inline-flex items-center justify-center gap-2"
          >
            Find a room <ArrowRight size={16} />
          </a>
          <a
            href="#why-us"
            className="btn-outline rounded-full px-6 py-3.5 text-center"
          >
            List your property
          </a>
        </div>
        <div className="mt-10 flex gap-8 font-mono text-sm">
          <div>
            <div className="text-2xl font-bold text-papaya">150+</div>
            <div className="text-ink/60">rooms mapped</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-papaya">1</div>
            <div className="text-ink/60">campus, and growing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-papaya">0₱</div>
            <div className="text-ink/60">to list, first month</div>
          </div>
        </div>
      </div>

      <div className="relative h-[420px] hidden sm:block">
        <img
          src="/asset/hero/1.jpg"
          alt="Boarding house room listing"
          className="listing-card card-tilt-1 absolute top-6 left-4 w-56 h-72 object-cover rounded-2xl shadow-xl border-4 border-white"
        />
        <img
          src="/asset/hero/4.jpg"
          alt="Boarding house room listing"
          className="listing-card card-tilt-2 absolute top-0 right-2 w-52 h-64 object-cover rounded-2xl shadow-xl border-4 border-white"
        />
        <img
          src="/asset/hero/3.jpg"
          alt="Boarding house room listing"
          className="listing-card card-tilt-3 absolute bottom-0 left-16 w-48 h-60 object-cover rounded-2xl shadow-xl border-4 border-white"
        />
      </div>
    </section>
  );
}

export default Hero;
