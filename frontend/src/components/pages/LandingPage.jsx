import Navbar from "../layouts/Navbar";
import Hero from "../layouts/landing/Hero";
import WhyUs from "../layouts/landing/WhyUs";
import Pricing from "../layouts/landing/Pricing";
import ContactUs from "../layouts/landing/ContactUs";
import Footer from "../layouts/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <WhyUs />
      <Pricing />
      <ContactUs />
      <Footer />
    </div>
  );
}
